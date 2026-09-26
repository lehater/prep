from __future__ import annotations

import json
import sys
import unittest
import urllib.error
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from anki_adapter import AnkiConnect, AnkiConnectError


class FakeResponse:
    def __init__(self, body: object):
        self._raw = json.dumps(body).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self):
        return self._raw


class AnkiConnectClientTests(unittest.TestCase):
    def test_invoke_returns_result_and_sends_v6_envelope(self):
        captured = {}

        def opener(request, timeout):
            captured["timeout"] = timeout
            captured["payload"] = json.loads(request.data.decode("utf-8"))
            return FakeResponse({"result": 6, "error": None})

        client = AnkiConnect("http://127.0.0.1:8765", opener=opener)
        self.assertEqual(6, client.invoke("version"))
        self.assertEqual(30, captured["timeout"])
        self.assertEqual(
            {"action": "version", "version": 6, "params": {}}, captured["payload"]
        )

    def test_api_error_becomes_typed_exception(self):
        def opener(request, timeout):
            return FakeResponse({"result": None, "error": "boom"})

        with self.assertRaisesRegex(AnkiConnectError, "boom"):
            AnkiConnect(opener=opener).invoke("version")

    def test_connection_error_becomes_typed_exception(self):
        def opener(request, timeout):
            raise urllib.error.URLError("offline")

        with self.assertRaisesRegex(AnkiConnectError, "Cannot connect"):
            AnkiConnect(opener=opener).invoke("version")


if __name__ == "__main__":
    unittest.main()
