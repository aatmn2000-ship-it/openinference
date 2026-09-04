---
"@arizeai/openinference-instrumentation-openai": patch
---

Accept a full API base URL, scheme-less path, or `host:port` in `getProviderFromHost`, so Meta AI, Z.ai, and MiniMax clients still record the real `llm.provider` when `baseURL` is passed instead of a bare hostname. Matching still uses label-boundary suffixes and now prefers the longest match.
