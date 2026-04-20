import type Anthropic from '@anthropic-ai/sdk';

// ---------------------------------------------------------------------------
// LLM client abstraction
// ---------------------------------------------------------------------------

export type CreateMessageParams = Anthropic.MessageCreateParamsNonStreaming;

export type LlmMessage = Anthropic.Message;

export interface LlmClient {
  createMessage(params: CreateMessageParams): Promise<LlmMessage>;
}

// ---------------------------------------------------------------------------
// LLM file cache
// ---------------------------------------------------------------------------

export type LlmCacheEnvelope = {
  promptFingerprint: string;
  promptVersion: string;
  model: string;
  message: LlmMessage;
};

// ---------------------------------------------------------------------------
// Generate feature
// ---------------------------------------------------------------------------

export type LlmCacheMode = 'off' | 'read' | 'readwrite';

export type GenerateDeps = {
  llm: LlmClient;
  model: string;
  maxTokens: number;
  cacheMode: LlmCacheMode;
  /** When null, file cache is disabled. */
  cacheDir: string | null;
  /** Directory of committed SongData JSON files (slug.json). */
  songsDir: string;
  /** Directory of persisted layout config files (`songSlug__templateId.json`). */
  layoutsDir: string;
};
