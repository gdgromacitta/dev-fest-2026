import os

MAX_MESSAGES = 12
MAX_MESSAGE_CHARS = 1_200
MAX_REQUEST_BYTES = 32_000
RATE_LIMIT_REQUESTS = 12
RATE_LIMIT_WINDOW_SECONDS = 10 * 60

DEFAULT_ALLOWED_ORIGINS = (
    "http://localhost:3000",
    "http://127.0.0.1:3000",
)


def model_name() -> str:
    configured = os.getenv("OPENAI_MODEL") or "gpt-5.4-nano"
    return configured if ":" in configured else f"openai-responses:{configured}"


def allowed_origins() -> list[str]:
    configured = os.getenv("GUIDE_ALLOWED_ORIGINS")
    if not configured:
        return list(DEFAULT_ALLOWED_ORIGINS)
    return [origin.strip() for origin in configured.split(",") if origin.strip()]


def is_deployed_environment() -> bool:
    environment = os.getenv("VERCEL_ENV") or os.getenv("LOGFIRE_ENVIRONMENT") or "local"
    return environment.casefold() in {"preview", "production"}
