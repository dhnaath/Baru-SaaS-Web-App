/** Stable content fingerprints used only to retire known built-in demo records. */
export const LEGACY_DYNAMIC_SEED_FIELDS: ReadonlySet<string> = new Set([
  "createdAt",
  "updatedAt",
  "startAt",
  "endAt",
  "dueAt",
  "targetDate",
  "joinedAt",
  "completedAt",
  "archivedAt",
  "editedAt",
  "lastEditedAt",
  "lastReviewedAt",
  "addedAt",
  "contributedAt",
]);

export function stableStringify(value: unknown, ignoredKeys: ReadonlySet<string> = new Set()): string {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item, ignoredKeys)).join(",")}]`;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).filter((key) => !ignoredKeys.has(key)).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(object[key], ignoredKeys)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function getRecordFingerprint(value: unknown, ignoredKeys: ReadonlySet<string> = new Set()): string {
  const serialized = stableStringify(value, ignoredKeys);
  let first = 2166136261 >>> 0;
  let second = 0x9e3779b9 >>> 0;
  for (let index = 0; index < serialized.length; index += 1) {
    const code = serialized.charCodeAt(index);
    first = Math.imul(first ^ code, 16777619) >>> 0;
    second = Math.imul(second ^ code, 2246822519) >>> 0;
  }
  return first.toString(16).padStart(8, "0") + second.toString(16).padStart(8, "0");
}

/** Keep anything that is not an exact known seed, including edited records sharing a seed ID. */
export function filterExactSeedRecords<T extends { id?: unknown }>(
  records: readonly T[],
  fingerprints: Readonly<Record<string, string>> | undefined,
  ignoredKeys: ReadonlySet<string> = new Set(),
): T[] {
  if (!fingerprints) return [...records];
  return records.filter((record) => {
    if (!record || typeof record.id !== "string") return true;
    const expected = fingerprints[record.id];
    return !expected || getRecordFingerprint(record, ignoredKeys) !== expected;
  });
}
