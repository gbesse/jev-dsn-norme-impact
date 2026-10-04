import type { Dossier, Document } from "./index.mjs";
export function parseRubrics(value: string): Map<string, string>;
export function importNormeDiff(
  before: string,
  after: string,
  rules: Record<string, unknown>[],
  options?: { beforeVersion?: string; afterVersion?: string; at?: string },
): Dossier;
