import Anthropic from '@anthropic-ai/sdk';
import type { CreateMessageParams, LlmClient, LlmMessage } from './types.ts';

export function createAnthropicLlmClient(options?: ConstructorParameters<typeof Anthropic>[0]): LlmClient {
  const client = new Anthropic(options);
  return {
    async createMessage(params: CreateMessageParams): Promise<LlmMessage> {
      return client.messages.create(params);
    },
  };
}
