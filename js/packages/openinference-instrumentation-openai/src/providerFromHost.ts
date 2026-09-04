import { LLMProvider } from "@arizeai/openinference-semantic-conventions";

/**
 * Maps hostname suffixes to their corresponding LLM provider value.
 */
export const HOST_SUFFIX_TO_PROVIDER: Record<string, LLMProvider> = {
  "api.openai.com": LLMProvider.OPENAI,
  "openai.azure.com": LLMProvider.AZURE,
  "services.ai.azure.com": LLMProvider.AZURE,
  "cognitiveservices.azure.com": LLMProvider.AZURE,
  "api.anthropic.com": LLMProvider.ANTHROPIC,
  "api.cohere.com": LLMProvider.COHERE,
  "api.cohere.ai": LLMProvider.COHERE,
  "api.mistral.ai": LLMProvider.MISTRALAI,
  "generativelanguage.googleapis.com": LLMProvider.GOOGLE,
  "aiplatform.googleapis.com": LLMProvider.GOOGLE,
  "amazonaws.com": LLMProvider.AWS,
  "api.x.ai": LLMProvider.XAI,
  "api.deepseek.com": LLMProvider.DEEPSEEK,
  "api.groq.com": LLMProvider.GROQ,
  "api.fireworks.ai": LLMProvider.FIREWORKS,
  "api.moonshot.cn": LLMProvider.MOONSHOT,
  "api.cerebras.ai": LLMProvider.CEREBRAS,
  "api.perplexity.ai": LLMProvider.PERPLEXITY,
  "api.together.ai": LLMProvider.TOGETHER,
  "api.together.xyz": LLMProvider.TOGETHER,
  "ollama.com": LLMProvider.OLLAMA,
  "api.meta.ai": LLMProvider.META,
  "api.z.ai": LLMProvider.ZAI,
  "api.minimax.io": LLMProvider.MINIMAX,
  "api.minimaxi.com": LLMProvider.MINIMAX,
  "api.minimax.chat": LLMProvider.MINIMAX,
};

/**
 * Extract a hostname from a raw host, host:port, or API base URL.
 * `new URL("api.meta.ai/v1")` fails without a scheme, which is why callers
 * that pass a bare baseURL would otherwise miss the suffix table.
 */
export function normalizeApiHost(hostOrUrl: string): string {
  const raw = hostOrUrl.toLowerCase().trim();
  if (!raw) {
    return "";
  }
  try {
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
    const hostname = new URL(candidate).hostname;
    if (hostname) {
      return hostname;
    }
  } catch {
    // fall through to the last-resort parser
  }
  const noPath = raw.split("/")[0] ?? raw;
  return noPath.replace(/:\d+$/, "");
}

/**
 * Return the LLM provider name for the given API hostname or base URL.
 */
export function getProviderFromHost(host: string): LLMProvider | undefined {
  const normalised = normalizeApiHost(host);
  if (!normalised) {
    return undefined;
  }
  let match: { suffix: string; provider: LLMProvider } | undefined;
  for (const [suffix, provider] of Object.entries(HOST_SUFFIX_TO_PROVIDER)) {
    // Anchor at a label boundary so e.g. "smollama.com" does not match the
    // "ollama.com" suffix. Prefer the longest suffix when several match.
    if (normalised === suffix || normalised.endsWith("." + suffix)) {
      if (!match || suffix.length > match.suffix.length) {
        match = { suffix, provider };
      }
    }
  }
  return match?.provider;
}
