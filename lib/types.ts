import type { Gender } from "@orrery/core";

export interface BirthForm {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
  unknownTime: boolean;
  latitude: number;
  longitude: number;
  cityName: string;
}
