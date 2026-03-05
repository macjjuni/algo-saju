import { calculateSaju, createChart, calculateNatal } from "@orrery/core";
import type { BirthForm } from "@/lib/types";
import { sajuToText, ziweiToText, natalToText } from "./text-export";
import { getCompressedFortuneText } from "./fortune-compression";

/**
 * BirthForm 데이터를 받아서 사주/자미/네이탈 차트 데이터를 텍스트로 생성
 */
export async function buildChartData(birthForm: BirthForm): Promise<string> {
  const sajuRaw = sajuToText(calculateSaju(birthForm));

  let ziweiRaw = "";
  if (!birthForm.unknownTime) {
    const chart = createChart(
      birthForm.year, birthForm.month, birthForm.day,
      birthForm.hour, birthForm.minute, birthForm.gender === "M",
    );
    ziweiRaw = ziweiToText(chart);
  }

  const natalRaw = natalToText(await calculateNatal(birthForm));

  const compressedResult = getCompressedFortuneText(sajuRaw, ziweiRaw, natalRaw);
  const prefix = birthForm.gender === "M" ? "# 남성" : "# 여성";

  return `${prefix}\n${compressedResult}`;
}
