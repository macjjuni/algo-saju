"use client";

import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { City } from "@orrery/core";
import { birthFormSchema, type BirthFormValues } from "@/lib/schema";
import type { CreateProfileRequest } from "@/lib/profile-api";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CityPicker from "./city-picker";

// region [Privates]
const CURRENT_YEAR = new Date().getFullYear();

function getDaysInMonth(year: number, month: number): number {
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
  latitude: 37.5665,
  longitude: 126.978,
  cityName: "서울",
};
// endregion

interface ProfileFormProps {
  defaultValues?: Partial<BirthFormValues>;
  onSubmit: (data: CreateProfileRequest) => Promise<void>;
  submitLabel?: string;
}

export default function ProfileForm({ defaultValues, onSubmit, submitLabel = "저장하기" }: ProfileFormProps) {
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
  const gender = watch("gender");
  const cityName = watch("cityName");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  // endregion

  // region [Privates]
  const dayOptions = useMemo(
    () => Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1),
    [year, month],
  );
  // endregion

  // region [Events]
  function onChangeYear(y: string) {
    const numY = Number(y);
    setValue("year", numY);
    const maxDay = getDaysInMonth(numY, month);
    if (watch("day") > maxDay) setValue("day", maxDay);
  }

  function onChangeMonth(m: string) {
    const numM = Number(m);
    setValue("month", numM);
    const maxDay = getDaysInMonth(year, numM);
    if (watch("day") > maxDay) setValue("day", maxDay);
  }

  function onSelectCity(city: City) {
    setValue("latitude", city.lat);
    setValue("longitude", city.lon);
    setValue("cityName", city.name);
  }

  function onFormSubmit(data: BirthFormValues) {
    startTransition(async () => {
      await onSubmit(data);
    });
  }
  // endregion

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* 이름 (선택) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">이름 (선택)</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="예: 본인, 배우자, 자녀 등"
            maxLength={16}
            {...form.register("name")}
          />
        </CardContent>
      </Card>

      {/* 생년월일 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">생년월일 (양력)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">년도</Label>
              <Select value={String(year)} onValueChange={onChangeYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}년</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">월</Label>
              <Select value={String(month)} onValueChange={onChangeMonth}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {monthOptions.map((m) => (
                    <SelectItem key={m} value={String(m)}>{m}월</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">일</Label>
              <Select value={String(watch("day"))} onValueChange={(v) => setValue("day", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {dayOptions.map((d) => (
                    <SelectItem key={d} value={String(d)}>{d}일</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {errors.day && <p className="mt-1 text-xs text-destructive">{errors.day.message}</p>}
        </CardContent>
      </Card>

      {/* 태어난 시간 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">태어난 시간</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="unknown-time" className="text-sm text-muted-foreground">모름</Label>
              <Switch
                id="unknown-time"
                checked={unknownTime}
                onCheckedChange={(v) => setValue("unknownTime", v)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">시</Label>
              <Select
                value={String(watch("hour"))}
                onValueChange={(v) => setValue("hour", Number(v))}
                disabled={unknownTime}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {hourOptions.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, "0")}시
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">분</Label>
              <Select
                value={String(watch("minute"))}
                onValueChange={(v) => setValue("minute", Number(v))}
                disabled={unknownTime}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {minuteOptions.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {String(m).padStart(2, "0")}분
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 성별 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">성별</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {([["M", "남성"], ["F", "여성"]] as const).map(([val, label]) => (
              <Button
                key={val}
                type="button"
                variant={gender === val ? "default" : "outline"}
                className="w-full"
                onClick={() => setValue("gender", val)}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 출생 위치 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">출생 위치</CardTitle>
        </CardHeader>
        <CardContent>
          <CityPicker
            value={{ name: cityName, lat: latitude, lon: longitude }}
            onChange={onSelectCity}
          />
          {errors.cityName && (
            <p className="mt-1 text-xs text-destructive">{errors.cityName.message}</p>
          )}
        </CardContent>
      </Card>

      {/* 제출 버튼 */}
      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "처리 중..." : submitLabel}
      </Button>
    </form>
  );
}
