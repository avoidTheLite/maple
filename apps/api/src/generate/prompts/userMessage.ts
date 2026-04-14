/** Template only — placeholders must match fingerprint inputs (not filled values). */
export const GENERATE_USER_MESSAGE_TEMPLATE = `Generate a complete Maple sheet for "{{title}}" by {{artist}}. Use your knowledge of the song to fill in accurate chord voicings (standard tuning unless otherwise noted), the main intro riff tab, verse lyrics with chord positions, chorus lyrics with chord positions, and a four-column harmonic analysis. Follow the coordinate system in the instructions exactly.`;

export function buildGenerateUserMessage(title: string, artist: string): string {
  return GENERATE_USER_MESSAGE_TEMPLATE.replaceAll('{{title}}', title).replaceAll(
    '{{artist}}',
    artist,
  );
}
