"use client";

import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { City } from "@orrery/core";
import { birthFormSchema, type BirthFormValues } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import CityPicker from "./city-picker";
import { CreateProfileRequest } from '@/services/profile'

// region [Privates]
const CURRENT_YEAR = new Date().getFullYear();

function getDaysInMonth(year: number, month: number, isLunar: boolean): number {
  if (isLunar) return 30;
  return new Date(year, month, 0).getDate();
}

const yearOptions = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, i) => CURRENT_YEAR - i);
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const hourOptions = Array.from({ length: 24 }, (_, i) => i);
const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

const DEFAULT_VALUES: BirthFormValues = {
  name: "",
  year: 2000,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  gender: "M",
  unknownTime: false,
  isLunar: false,
  isLeapMonth: false,
  latitude: 37.5665,
  longitude: 126.978,
  cityName: "서울",
  privacyConsent: false as unknown as true,
};
// endregion

interface ProfileFormProps {
  defaultValues?: Partial<BirthFormValues>;
  onSubmit: (data: CreateProfileRequest) => Promise<void>;
  submitLabel?: string;
  hidePrivacyConsent?: boolean;
}

export default function ProfileForm({ defaultValues, onSubmit, submitLabel = "저장하기", hidePrivacyConsent }: ProfileFormProps) {
  // region [Hooks]
  const [isPending, startTransition] = useTransition();

  const form = useForm<BirthFormValues>({
    resolver: zodResolver(birthFormSchema),
    defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
  });

  const { watch, setValue, handleSubmit, formState: { errors } } = form;
  const year = watch("year");
  const month = watch("month");
  const unknownTime = watch("unknownTime");
  const isLunar = watch("isLunar");
  const isLeapMonth = watch("isLeapMonth");
  const gender = watch("gender");
  const cityName = watch("cityName");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  // endregion

  // region [Privates]
  const dayOptions = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month, isLunar) }, (_, i) => i + 1),
    [year, month, isLunar],
  );
  // endregion

  // region [Events]
  function onChangeYear(y: string) {
    const numY = Number(y);
    setValue("year", numY);
    const maxDay = getDaysInMonth(numY, month, isLunar);
    if (watch("day") > maxDay) setValue("day", maxDay);
  }

  function onChangeMonth(m: string) {
    const numM = Number(m);
    setValue("month", numM);
    const maxDay = getDaysInMonth(year, numM, isLunar);
    if (watch("day") > maxDay) setValue("day", maxDay);
  }

  function onChangeLunar(checked: boolean) {
    setValue("isLunar", checked);
    if (!checked) setValue("isLeapMonth", false);
    const maxDay = getDaysInMonth(year, month, checked);
    if (watch("day") > maxDay) setValue("day", maxDay);
  }

  function onSelectCity(city: City) {
    setValue("latitude", city.lat);
    setValue("longitude", city.lon);
    setValue("cityName", city.name);
  }

  function onFormSubmit(data: BirthFormValues) {
    startTransition(async () => {
      const { privacyConsent: _privacyConsent, isLeapMonth: leap, ...payload } = data;
      if (payload.isLunar && leap) {
        payload.month = -Math.abs(payload.month);
      }
      await onSubmit(payload);
    });
  }
  // endregion

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* 이름 */}
      <section className="space-y-4">
        <Label className="text-sm font-medium">이름</Label>
        <Input
          placeholder="예: 본인, 배우자, 친구 등"
          maxLength={16}
          {...form.register("name")}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </section>

      {/* 생년월일 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">생년월일 ({isLunar ? "음력" : "양력"})</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="is-lunar" className="text-sm text-muted-foreground">음력</Label>
            <Switch
              id="is-lunar"
              checked={isLunar}
              onCheckedChange={onChangeLunar}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Select value={String(year)} onValueChange={onChangeYear}>
            <SelectTrigger><SelectValue placeholder="년도" /></SelectTrigger>
            <SelectContent className="max-h-60">
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}년</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(month)} onValueChange={onChangeMonth}>
            <SelectTrigger><SelectValue placeholder="월" /></SelectTrigger>
            <SelectContent>
              {monthOptions.map((m) => (
                <SelectItem key={m} value={String(m)}>{m}월</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(watch("day"))} onValueChange={(v) => setValue("day", Number(v))}>
            <SelectTrigger><SelectValue placeholder="일" /></SelectTrigger>
            <SelectContent>
              {dayOptions.map((d) => (
                <SelectItem key={d} value={String(d)}>{d}일</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.day && <p className="text-xs text-destructive">{errors.day.message}</p>}
        {isLunar && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-white/20 accent-primary"
              checked={isLeapMonth}
              onChange={(e) => setValue("isLeapMonth", e.target.checked)}
            />
            <span className="text-sm text-muted-foreground">윤달</span>
          </label>
        )}
      </section>

      {/* 태어난 시간 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">태어난 시간</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="unknown-time" className="text-sm text-muted-foreground">모름</Label>
            <Switch
              id="unknown-time"
              checked={unknownTime}
              onCheckedChange={(v) => setValue("unknownTime", v)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            value={String(watch("hour"))}
            onValueChange={(v) => setValue("hour", Number(v))}
            disabled={unknownTime}
          >
            <SelectTrigger><SelectValue placeholder="시" /></SelectTrigger>
            <SelectContent className="max-h-60">
              {hourOptions.map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {String(h).padStart(2, "0")}시
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(watch("minute"))}
            onValueChange={(v) => setValue("minute", Number(v))}
            disabled={unknownTime}
          >
            <SelectTrigger><SelectValue placeholder="분" /></SelectTrigger>
            <SelectContent className="max-h-60">
              {minuteOptions.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {String(m).padStart(2, "0")}분
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* 성별 */}
      <section className="space-y-4">
        <Label className="text-sm font-medium">성별</Label>
        <div className="grid grid-cols-2 gap-3">
          {([["M", "남성"], ["F", "여성"]] as const).map(([val, label]) => (
            <Button
              key={val}
              type="button"
              variant={gender === val ? "default" : "outline"}
              className={`w-full ${gender === val ? "text-foreground bg-purple-600/70 hover:bg-purple-600/80" : ""}`}
              onClick={() => setValue("gender", val)}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      {/* 출생 위치 */}
      <section className="space-y-4">
        <Label className="text-sm font-medium">출생 위치</Label>
        <CityPicker
          value={{ name: cityName, lat: latitude, lon: longitude }}
          onChange={onSelectCity}
        />
        {errors.cityName && (
          <p className="text-xs text-destructive">{errors.cityName.message}</p>
        )}
      </section>

      {/* 개인정보 수집·이용 동의 */}
      {!hidePrivacyConsent && (
        <section className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            입력된 개인정보(이름, 생년월일, 성별, 출생 위치)는 운세 분석 목적으로만 사용되며, 분석 외 다른 용도로 활용되지 않습니다. 프로필은 언제든지 삭제할 수 있으며, 삭제 시 관련 정보가 모두 제거됩니다.
          </p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border border-white/20 accent-primary"
              {...form.register("privacyConsent")}
            />
            <span className="text-sm">개인정보 수집·이용에 동의합니다.</span>
          </label>
          {errors.privacyConsent && (
            <p className="text-xs text-destructive">{errors.privacyConsent.message}</p>
          )}
        </section>
      )}

      {/* 제출 버튼 */}
      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "처리 중..." : submitLabel}
      </Button>
    </form>
  );
}
