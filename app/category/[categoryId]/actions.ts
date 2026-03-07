"use server";

import { auth } from '@/lib/auth'
import { requestFortune } from '@/api/fortune'
import { buildChartData } from '@/lib/build-chart-data'
import type { BirthForm } from '@/lib/types'

export async function analyzeFortuneAction(
  birthForms: BirthForm[],
  templateId: number
): Promise<{ result: string } | { error: string }> {
  const session = await auth()
  if (!session?.backendToken) return { error: '로그인이 필요합니다.' }

  const chartDataParts = await Promise.all(
    birthForms.map((form) => buildChartData(form))
  )

  const chartData = chartDataParts.join('\n\n')

  try {
    const response = await requestFortune(session.backendToken, { chartData, promptTemplateId: templateId })
    return { result: response.result }
  } catch (err) {
    const status = (err as Error & { status?: number }).status
    if (status === 429) {
      return { error: '오늘의 분석 횟수를 모두 사용했습니다. 자정에 초기화됩니다.' }
    }
    return { error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  }
}
