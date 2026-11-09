export const clampLineNumber = function(line: number, maxLine: number): number {
  if (!Number.isFinite(line)) return 1;
  return Math.min(Math.max(1, Math.trunc(line)), maxLine);
};
