from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any, Callable


class AnkiConnectError(RuntimeError):
    """Raised when AnkiConnect cannot be reached or returns an invalid/error response."""


UrlOpener = Callable[..., Any]


class AnkiConnect:
    """Minimal dependency-free AnkiConnect v6 client.

    The class owns HTTP transport only. Domain-to-Anki mapping and reconciliation
    semantics live outside the transport client.
    """

    def __init__(
        self,
        url: str = "http://127.0.0.1:8765",
        *,
        version: int = 6,
        timeout: int = 30,
        opener: UrlOpener | None = None,
    ) -> None:
        self.url = url
        self.version = version
        self.timeout = timeout
        self._opener = opener or urllib.request.urlopen

    def invoke(self, action: str, **params: Any) -> Any:
        payload = json.dumps(
            {"action": action, "version": self.version, "params": params}
        ).encode("utf-8")
        request = urllib.request.Request(
            self.url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with self._opener(request, timeout=self.timeout) as response:
                raw = response.read().decode("utf-8")
        except (urllib.error.URLError, OSError) as exc:
            raise AnkiConnectError(
                f"Cannot connect to AnkiConnect at {self.url}: {exc}"
            ) from exc

        try:
            body = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise AnkiConnectError(
                f"Invalid JSON response from AnkiConnect for {action}: {raw!r}"
            ) from exc

        if not isinstance(body, dict) or "error" not in body or "result" not in body:
            raise AnkiConnectError(
                f"Invalid AnkiConnect response envelope for {action}: {body!r}"
            )
        if body["error"] is not None:
            raise AnkiConnectError(f"AnkiConnect {action} failed: {body['error']}")
        return body["result"]
