---
"@arizeai/openinference-instrumentation-openai": patch
---

Add `normalizeApiHost` and a URL-aware `getProviderFromHost` implementation so Meta AI, Z.ai, and MiniMax can be resolved from a full `baseURL`, scheme-less path, or `host:port`. Label-boundary suffix matching is unchanged and the longest suffix wins.
