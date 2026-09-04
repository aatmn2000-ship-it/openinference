import { LLMProvider } from "@arizeai/openinference-semantic-conventions";

import {
  HOST_SUFFIX_TO_PROVIDER,
  getProviderFromHost,
  normalizeApiHost,
} from "../src/providerFromHost";

const ALL_PROVIDER_VALUES = new Set(Object.values(LLMProvider));

describe("normalizeApiHost", () => {
  it("strips scheme, path, and port", () => {
    expect(normalizeApiHost("https://api.meta.ai/v1")).toBe("api.meta.ai");
    expect(normalizeApiHost("api.z.ai/api/paas/v4")).toBe("api.z.ai");
    expect(normalizeApiHost("API.MINIMAX.IO:443")).toBe("api.minimax.io");
  });
});

describe("getProviderFromHost", () => {
  it.each([
    ["https://api.meta.ai/v1", LLMProvider.META],
    ["https://api.z.ai/api/paas/v4", LLMProvider.ZAI],
    ["https://api.minimax.io/v1", LLMProvider.MINIMAX],
    ["api.meta.ai/v1", LLMProvider.META],
    ["api.z.ai/api/paas/v4", LLMProvider.ZAI],
    ["us.api.meta.ai", LLMProvider.META],
    ["api.minimax.io:443", LLMProvider.MINIMAX],
    ["https://api.minimaxi.com/v1/", LLMProvider.MINIMAX],
    ["https://api.minimax.chat/v1", LLMProvider.MINIMAX],
    ["api.openai.com", LLMProvider.OPENAI],
  ])("resolves %s to %s", (host, expected) => {
    expect(getProviderFromHost(host)).toBe(expected);
  });

  it.each(["smollama.com", "notapi.z.ai", "meta.ai.example.com", ""])(
    "returns undefined for %s",
    (host) => {
      expect(getProviderFromHost(host)).toBeUndefined();
    },
  );

  it("every provider has at least one host entry", () => {
    const mapped = new Set(Object.values(HOST_SUFFIX_TO_PROVIDER));
    const missing = [...ALL_PROVIDER_VALUES].filter((p) => !mapped.has(p));
    expect(missing).toEqual([]);
  });
});
