import os

import logfire
from fastapi import FastAPI


def configure_observability() -> None:
    logfire.configure(
        send_to_logfire="if-token-present",
        service_name="devfest-guide-api",
        environment=os.getenv("LOGFIRE_ENVIRONMENT") or "local",
    )
    logfire.instrument_pydantic_ai(include_content=False)


def instrument_fastapi(app: FastAPI) -> None:
    logfire.instrument_fastapi(app)
