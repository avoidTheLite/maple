import { createHash } from 'node:crypto';
import { SONG_DATA_TOOL } from '../mapleSheetTool.ts';
import { buildSystemPrompt } from './system.ts';
import { GENERATE_USER_MESSAGE_TEMPLATE } from './userMessage.ts';

/** Bump when you intentionally change prompt prose or tool shape without changing derived fingerprint inputs. */
export const PROMPT_VERSION = '1.0.0';

/**
 * Fingerprint of everything sent to the model as prompt identity (system, tool schema, user template with placeholders).
 */
export function computePromptFingerprint(): string {
  const system = buildSystemPrompt();
  const toolsJson = JSON.stringify([SONG_DATA_TOOL]);
  const payload = [PROMPT_VERSION, system, toolsJson, GENERATE_USER_MESSAGE_TEMPLATE].join('\n---\n');
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}
