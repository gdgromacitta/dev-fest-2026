import json
from datetime import date, datetime
from pathlib import Path
from typing import Any, Literal
from zoneinfo import ZoneInfo

ROOT_DIR = Path(__file__).resolve().parents[1]
KNOWLEDGE: dict[str, Any] = json.loads(
    (ROOT_DIR / "data" / "devfest-knowledge.json").read_text(encoding="utf-8")
)
ROME_TIMEZONE = ZoneInfo("Europe/Rome")
GuideLocale = Literal["it", "en"]

WEEKDAYS = {
    "it": ("lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"),
    "en": ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
}


def _localize(value: Any, locale: GuideLocale) -> Any:
    if isinstance(value, dict):
        if set(value) == {"it", "en"}:
            return value[locale]
        return {key: _localize(item, locale) for key, item in value.items()}
    if isinstance(value, list):
        return [_localize(item, locale) for item in value]
    return value


def _published(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [item for item in items if item.get("published") is True]


def get_current_date(locale: GuideLocale = "it") -> dict[str, str]:
    """Return today's date and weekday in the event's Europe/Rome timezone."""
    now = datetime.now(ROME_TIMEZONE)
    return {
        "date": now.date().isoformat(),
        "weekday": WEEKDAYS[locale][now.weekday()],
        "timezone": ROME_TIMEZONE.key,
    }


def get_event_info(locale: GuideLocale = "it") -> dict[str, Any]:
    """Return verified public information about DevFest Roma 2026 and its CFP."""
    event = _localize(KNOWLEDGE["event"], locale)
    cfp = _localize(KNOWLEDGE["cfp"], locale)
    deadline = date.fromisoformat(KNOWLEDGE["cfp"]["deadline"])
    cfp["status"] = "open" if datetime.now(ROME_TIMEZONE).date() <= deadline else "closed"
    return {"event": event, "cfp": cfp, "tracks": _localize(KNOWLEDGE["tracks"], locale)}


def get_venue_info(locale: GuideLocale = "it") -> dict[str, Any]:
    """Return the verified venue, transport, parking, and accessibility information."""
    return _localize(KNOWLEDGE["venue"], locale)


def list_sessions(
    topic: str | None = None,
    speaker: str | None = None,
    track: str | None = None,
    locale: GuideLocale = "it",
) -> list[dict[str, Any]]:
    """List only announced sessions, optionally filtered by topic, speaker, or track."""
    sessions = _published(KNOWLEDGE["sessions"])
    filters = [value.casefold() for value in (topic, speaker, track) if value]
    if filters:
        sessions = [
            session
            for session in sessions
            if all(needle in json.dumps(session, ensure_ascii=False).casefold() for needle in filters)
        ]
    return _localize(sessions, locale)


def get_session_details(session_id_or_title: str, locale: GuideLocale = "it") -> dict[str, Any]:
    """Return one announced session by exact ID/title or one unique partial title match."""
    needle = session_id_or_title.casefold().strip()
    sessions = _published(KNOWLEDGE["sessions"])
    for session in sessions:
        titles = session.get("title", {})
        localized_titles = [str(title).casefold() for title in titles.values()]
        if needle == session["id"].casefold() or needle in localized_titles:
            return _localize(session, locale)

    partial_matches = [
        session
        for session in sessions
        if needle in session["id"].casefold()
        or any(needle in str(title).casefold() for title in session.get("title", {}).values())
    ]
    if len(partial_matches) == 1:
        return _localize(partial_matches[0], locale)
    return {"found": False, "message": "No unique announced session was found."}


def list_speakers(query: str | None = None, locale: GuideLocale = "it") -> list[dict[str, Any]]:
    """List only announced speakers, optionally filtering public profile fields."""
    speakers = _published(KNOWLEDGE["speakers"])
    if query:
        needle = query.casefold()
        speakers = [
            speaker
            for speaker in speakers
            if needle in json.dumps(speaker, ensure_ascii=False).casefold()
        ]
    return _localize(speakers, locale)


def list_organizers(query: str | None = None, locale: GuideLocale = "it") -> list[dict[str, Any]]:
    """List public DevFest Roma organizers, optionally filtering by name or role."""
    organizers = _published(KNOWLEDGE["organizers"])
    if query:
        needle = query.casefold()
        organizers = [
            organizer
            for organizer in organizers
            if needle in json.dumps(organizer, ensure_ascii=False).casefold()
        ]
    return _localize(organizers, locale)


def get_official_links(locale: GuideLocale = "it") -> list[dict[str, Any]]:
    """Return verified official links for registration, CFP, maps, sponsors, and contact."""
    return _localize(KNOWLEDGE["official_links"], locale)


def get_guide_info(locale: GuideLocale = "it") -> dict[str, Any]:
    """Return the wolf mascot's identity, role, personality, and limitations."""
    return _localize(KNOWLEDGE["guide"], locale)
