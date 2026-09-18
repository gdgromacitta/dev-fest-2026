import json
import logging
from collections.abc import AsyncIterator

from pydantic_ai import UsageLimits
from pydantic_ai.messages import ModelMessage, ModelRequest, ModelResponse, TextPart, UserPromptPart

from devfest_guide.agent import guide_agent
from devfest_guide.models import ChatMessage, ChatPayload

logger = logging.getLogger(__name__)

ERROR_MESSAGES = {
    "it": "Il mio fiuto si è momentaneamente perso. Riprova tra poco.",
    "en": "My nose has temporarily lost the trail. Please try again shortly.",
}


def build_message_history(messages: list[ChatMessage]) -> list[ModelMessage]:
    history: list[ModelMessage] = []
    for message in messages[:-1]:
        if message.role == "user":
            history.append(ModelRequest(parts=[UserPromptPart(content=message.content)]))
        else:
            history.append(ModelResponse(parts=[TextPart(content=message.content)]))
    return history


def sse_event(event_type: str, **data: object) -> str:
    return f"data: {json.dumps({'type': event_type, **data}, ensure_ascii=False)}\n\n"


async def stream_guide(payload: ChatPayload) -> AsyncIterator[str]:
    language = "Italian" if payload.locale == "it" else "English"
    latest_prompt = (
        f"[Trusted conversation locale: {payload.locale}. Reply in {language}.]\n\n"
        f"Visitor message: {payload.messages[-1].content}"
    )
    history = build_message_history(payload.messages)
    try:
        async with guide_agent.run_stream(
            latest_prompt,
            message_history=history,
            usage_limits=UsageLimits(request_limit=6, tool_calls_limit=5, output_tokens_limit=500),
        ) as result:
            async for delta in result.stream_text(delta=True):
                if delta:
                    yield sse_event("delta", text=delta)
        yield sse_event("done")
    except Exception:
        logger.exception("DevFest guide agent request failed")
        yield sse_event("error", message=ERROR_MESSAGES[payload.locale])
