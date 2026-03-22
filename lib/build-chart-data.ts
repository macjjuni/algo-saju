import { calculateSaju, createChart, calculateNatal } from "@orrery/core";
import type { BirthForm } from "@/lib/types";
import { sajuToText, ziweiToText, natalToText } from "./text-export";
import { getCompressedFortuneText } from "./fortune-compression";
import { lunarToSolar } from "./lunar-convert";

/**
 * BirthForm 데이터를 받아서 사주/자미/네이탈 차트 데이터를 텍스트로 생성
 * isLunar가 true이면 음력→양력 변환 후 계산
 */
export async function buildChartData(birthForm: BirthForm): Promise<string> {
  let input = birthForm;

  if (birthForm.isLunar) {
    const solar = lunarToSolar({
      year: birthForm.year,
      month: birthForm.month,
      day: birthForm.day,
    });
    input = { ...birthForm, ...solar };
  }

  const sajuRaw = sajuToText(calculateSaju(input));

  let ziweiRaw = "";
  if (!input.unknownTime) {
    const chart = createChart(
      input.year, input.month, input.day,
      input.hour, input.minute, input.gender === "M",
    );
    ziweiRaw = ziweiToText(chart);
  }

  const natalRaw = natalToText(await calculateNatal(input));

  const compressedResult = getCompressedFortuneText(sajuRaw, ziweiRaw, natalRaw);
  const prefix = input.gender === "M" ? "# 남성" : "# 여성";

  return `${prefix}\n${compressedResult}`;
}
