import type Anthropic from '@anthropic-ai/sdk';

export type CreateMessageParams = Anthropic.MessageCreateParamsNonStreaming;

export type LlmMessage = Anthropic.Message;

export interface LlmClient {
  createMessage(params: CreateMessageParams): Promise<LlmMessage>;
}
