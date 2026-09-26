export function targetSectionPath(
  targetId: string,
  section: "overview" | "knowledge" | "study" | "statistics",
): string {
  return `/learning/${encodeURIComponent(targetId)}/${section}`;
}

export function knowledgeFocusPath(
  targetId: string,
  knowledgeIds: readonly string[],
): string {
  const params = new URLSearchParams();
  if (knowledgeIds.length > 0) {
    params.set("focus", knowledgeIds.join(","));
  }
  const query = params.toString();
  return `${targetSectionPath(targetId, "knowledge")}${query ? `?${query}` : ""}`;
}
