"use client";

import { useState, useMemo } from "react";
import { KOREAN_CITIES, type City } from "@orrery/core";
import { Button } from "@/components/ui/button";

// 권역별 대표 도시만 사용
const REGION_CITY_NAMES = ["서울", "대전", "광주", "대구", "부산", "춘천", "제주"];
const REGION_CITIES = KOREAN_CITIES.filter((c) => REGION_CITY_NAMES.includes(c.name));
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CityPickerProps {
  value: { name: string; lat: number; lon: number };
  onChange: (city: City) => void;
}

export default function CityPicker({ value, onChange }: CityPickerProps) {
  // region [Hooks]
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // endregion

  // region [Privates]
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REGION_CITIES;
    return REGION_CITIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);
  // endregion

  // region [Events]
  function onSelect(city: City) {
    onChange(city);
    setOpen(false);
    setQuery("");
  }
  // endregion

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal">
          {value.name || "도시 선택"}
          <span className="text-xs text-muted-foreground">&#x25BC;</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="도시명 검색 (예: 서울, 부산)"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>검색 결과 없음</CommandEmpty>
            <CommandGroup>
              {filtered.map((city) => (
                <CommandItem
                  key={`${city.name}-${city.lat}`}
                  onSelect={() => onSelect(city)}
                  className={
                    city.lat === value.lat && city.lon === value.lon
                      ? "bg-accent font-semibold"
                      : ""
                  }
                >
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
