import type { Gender } from "@orrery/core";
import type { ErrorCode } from "@/lib/api-client";

export type ActionResult<T = void> =
  | ({ success: true } & (T extends void ? object : { data: T }))
  | { success: false; code: ErrorCode; error: string };

export interface BirthForm {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
  unknownTime: boolean;
  isLunar: boolean;
  latitude: number;
  longitude: number;
  cityName: string;
}
