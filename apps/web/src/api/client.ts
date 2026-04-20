import type { SheetLayoutConfig, SongData } from '@maple/types';
import { SheetLayoutConfigSchema, SongDataSchema } from './schemas.ts';

interface ApiErrorBody {
  error?: string;
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseErrorResponse(res: Response): Promise<ApiError> {
  let payload: ApiErrorBody | null = null;

  try {
    payload = (await res.json()) as ApiErrorBody;
  } catch {
    payload = null;
  }

  return new ApiError(payload?.error ?? `Request failed (${res.status})`, res.status);
}

export async function generateSongData(title: string, artist: string): Promise<SongData> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, artist }),
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const payload: unknown = await res.json();
  return SongDataSchema.parse(payload) as SongData;
}

export async function loadLayoutConfig(
  songSlug: string,
  templateId: string,
): Promise<SheetLayoutConfig | null> {
  const res = await fetch(`/api/layouts/${songSlug}?template=${encodeURIComponent(templateId)}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const payload: unknown = await res.json();
  return SheetLayoutConfigSchema.parse(payload) as SheetLayoutConfig;
}

export async function saveLayoutConfig(
  songSlug: string,
  templateId: string,
  layout: SheetLayoutConfig,
): Promise<SheetLayoutConfig> {
  const payload = {
    ...layout,
    songSlug,
    templateId,
  };
  const res = await fetch(`/api/layouts/${songSlug}?template=${encodeURIComponent(templateId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const responseBody: unknown = await res.json();
  return SheetLayoutConfigSchema.parse(responseBody) as SheetLayoutConfig;
}
