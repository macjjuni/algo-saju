import { Lunar } from "lunar-javascript";

interface LunarToSolarInput {
  year: number;
  month: number; // 윤달이면 음수 (예: -6)
  day: number;
}

interface SolarDate {
  year: number;
  month: number;
  day: number;
}

/** 음력 날짜를 양력으로 변환 */
export function lunarToSolar(input: LunarToSolarInput): SolarDate {
  const lunar = Lunar.fromYmd(input.year, input.month, input.day);
  const solar = lunar.getSolar();
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
}
