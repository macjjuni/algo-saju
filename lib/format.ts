import { STEM_INFO, BRANCH_ELEMENT, ELEMENT_HANJA, type Element, type RelationResult } from "@orrery/core";

export const ELEMENT_COLOR: Record<Element, string> = {
  tree: "#22c55e",
  fire: "#ef4444",
  earth: "#eab308",
  metal: "#9ca3af",
  water: "#1a1a1a",
};

export function stemElement(stem: string): Element | undefined {
  return STEM_INFO[stem]?.element;
}

export function branchElement(branch: string): Element | undefined {
  return BRANCH_ELEMENT[branch];
}

export function stemColor(stem: string): string {
  const el = stemElement(stem);
  return el ? ELEMENT_COLOR[el] : "#374151";
}

export function branchColor(branch: string): string {
  const el = branchElement(branch);
  return el ? ELEMENT_COLOR[el] : "#374151";
}

/** 2글자 한자 포맷 (1글자면 앞에 공백) */
export function fmt2(s: string): string {
  if (s.length === 1) return ` ${s} `;
  return s;
}

export function formatRelation(rel: RelationResult): string {
  if (rel.detail === null) return rel.type;
  if (ELEMENT_HANJA[rel.detail]) return `${rel.type}${ELEMENT_HANJA[rel.detail]}`;
  return `${rel.type}(${rel.detail})`;
}
