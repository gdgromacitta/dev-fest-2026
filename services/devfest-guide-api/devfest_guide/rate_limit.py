import asyncio
import logging
import os
import time

import httpx

from devfest_guide.config import (
    RATE_LIMIT_REQUESTS,
    RATE_LIMIT_WINDOW_SECONDS,
    is_deployed_environment,
)

logger = logging.getLogger(__name__)


class MemoryRateLimiter:
    def __init__(self) -> None:
        self._entries: dict[str, tuple[int, float]] = {}
        self._lock = asyncio.Lock()

    async def allow(self, identifier: str) -> bool:
        now = time.monotonic()
        async with self._lock:
            count, expires_at = self._entries.get(identifier, (0, now + RATE_LIMIT_WINDOW_SECONDS))
            if expires_at <= now:
                count, expires_at = 0, now + RATE_LIMIT_WINDOW_SECONDS
            if count >= RATE_LIMIT_REQUESTS:
                return False
            self._entries[identifier] = (count + 1, expires_at)
            return True


memory_rate_limiter = MemoryRateLimiter()


async def check_rate_limit(identifier: str) -> bool:
    url = os.getenv("UPSTASH_REDIS_REST_URL")
    token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
    if not url or not token:
        if is_deployed_environment():
            logger.error("Upstash rate limiting is required in deployed environments")
            return False
        return await memory_rate_limiter.allow(identifier)

    bucket = int(time.time() // RATE_LIMIT_WINDOW_SECONDS)
    key = f"devfest-guide-chat:{identifier}:{bucket}"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.post(
                f"{url.rstrip('/')}/pipeline",
                headers={"Authorization": f"Bearer {token}"},
                json=[["INCR", key], ["EXPIRE", key, RATE_LIMIT_WINDOW_SECONDS, "NX"]],
            )
            response.raise_for_status()
    except httpx.HTTPError:
        logger.exception("DevFest guide Upstash rate limit unavailable")
        if is_deployed_environment():
            return False
        return await memory_rate_limiter.allow(identifier)

    results = response.json()
    return int(results[0]["result"]) <= RATE_LIMIT_REQUESTS
