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

/** 생년월일 포맷 (예: 2000.01.15 12:30 또는 시간 미상) */
export function formatBirth(p: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  unknownTime: boolean;
}): string {
  const date = `${p.year}.${String(p.month).padStart(2, '0')}.${String(p.day).padStart(2, '0')}`;
  if (p.unknownTime) return `${date} (시간 미상)`;
  return `${date} ${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`;
}

export function formatRelation(rel: RelationResult): string {
  if (rel.detail === null) return rel.type;
  if (ELEMENT_HANJA[rel.detail]) return `${rel.type}${ELEMENT_HANJA[rel.detail]}`;
  return `${rel.type}(${rel.detail})`;
}
