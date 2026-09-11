from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from devfest_guide.config import MAX_MESSAGE_CHARS, MAX_MESSAGES

GuideLocale = Literal["it", "en"]


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)


class ChatPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    locale: GuideLocale
    messages: list[ChatMessage] = Field(min_length=1, max_length=MAX_MESSAGES)

    @model_validator(mode="after")
    def validate_conversation(self) -> Self:
        if self.messages[-1].role != "user":
            raise ValueError("The last message must be from the user")
        if self.messages[0].role != "user":
            raise ValueError("The conversation must start with a user message")
        for previous, current in zip(self.messages, self.messages[1:], strict=False):
            if previous.role == current.role:
                raise ValueError("Message roles must alternate")
        return self
