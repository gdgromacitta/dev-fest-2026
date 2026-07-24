from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import ValidationError
from starlette.responses import Response

from devfest_guide.config import MAX_REQUEST_BYTES, allowed_origins
from devfest_guide.models import ChatPayload
from devfest_guide.observability import instrument_fastapi
from devfest_guide.rate_limit import check_rate_limit
from devfest_guide.service import stream_guide

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Accept", "Content-Type"],
)
instrument_fastapi(app)


def client_identifier(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", maxsplit=1)[0].strip()
    if request.client:
        return request.client.host
    return "anonymous"


@app.get("/")
@app.get("/health")
@app.get("/api/guide/health")
async def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/")
@app.post("/api/guide")
async def chat(request: Request) -> Response:
    raw_body = await request.body()
    if len(raw_body) > MAX_REQUEST_BYTES:
        return JSONResponse({"ok": False, "error": "Request too large"}, status_code=413)

    try:
        payload = ChatPayload.model_validate_json(raw_body)
    except ValidationError:
        return JSONResponse({"ok": False, "error": "Invalid conversation"}, status_code=422)

    if not await check_rate_limit(client_identifier(request)):
        message = (
            "Lupetta ha bisogno di una breve pausa. Riprova più tardi."
            if payload.locale == "it"
            else "Lupetta needs a short break. Please try again later."
        )
        return JSONResponse({"ok": False, "error": message}, status_code=429)

    return StreamingResponse(
        stream_guide(payload),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )
