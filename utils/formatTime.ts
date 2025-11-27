/**
 * formatTime.ts
 *
 * Utilities for formatting Date objects:
 *  - formatDigitalTime(date): "HH:MM:SS"
 *  - formatSpeechTime(date):  "H時M分です。"
 *
 * FR-02: 時刻フォーマット関数
 */

function assertValidDate(date: Date): Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError('formatTime: expected a valid Date object');
  }
  return date;
}

function pad2(n: number): string {
  // - 引数 `n` が有限数 (Number.isFinite) の場合は Math.abs で負号を取り、
  //   Math.trunc で小数点以下を切り捨てた整数部分を扱います。
  // - 有限数でない場合（NaN, Infinity 等）は 0 を用います。
  // - 最終的に String(t).padStart(2, '0') によって先頭ゼロを補い、"00"〜"99" の形式で返します。
  // 例: pad2(9) -> "09", pad2(-3.7) -> "03", pad2(12) -> "12", pad2(NaN) -> "00"
  const t = Number.isFinite(n) ? Math.trunc(Math.abs(n)) : 0;
  return String(t).padStart(2, '0');
}

/**
 * formatDigitalTime
 *
 * Format a Date into "HH:MM:SS" (zero-padded).
 *
 * Example: 9:5:3 -> "09:05:03"
 */
export function formatDigitalTime(date: Date): string {
  const d = assertValidDate(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

/**
 * formatSpeechTime
 *
 * Format a Date into a Japanese speech-friendly string:
 * "H時M分です。"
 *
 * Note: Hours and minutes are not zero-padded in this format
 * (e.g., 9:05 -> "9時5分です。").
 */
export function formatSpeechTime(date: Date): string {
  const d = assertValidDate(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${hours}時${minutes}分です。`;
}
