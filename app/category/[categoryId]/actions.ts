"use server";

import { auth } from '@/lib/auth'
import { ApiError } from '@/lib/api-client'
import { requestFortune } from '@/api/fortune'
import { buildChartData } from '@/lib/build-chart-data'
import { decrypt } from '@/lib/crypto'
import type { BirthForm, ActionResult } from '@/lib/types'

export async function analyzeFortuneAction(
  encryptedData: string,
  templateId: number
): Promise<ActionResult<string>> {
  const session = await auth()
  if (!session?.backendToken) return { success: false, code: 'UNAUTHORIZED', error: '로그인이 필요합니다.' }

  let birthForms: BirthForm[]
  try {
    const decrypted = await decrypt(encryptedData)
    birthForms = JSON.parse(decrypted) as BirthForm[]
  } catch {
    return { success: false, code: 'INTERNAL_ERROR', error: '데이터 복호화에 실패했습니다.' }
  }

  const chartDataParts = await Promise.all(
    birthForms.map((form) => buildChartData(form))
  )

  const chartData = chartDataParts.join('\n\n')

  try {
    const response = await requestFortune(session.backendToken, { chartData, promptTemplateId: templateId })
    return { success: true, data: response.result }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.code === 'TOO_MANY_REQUESTS') {
        return { success: false, code: err.code, error: '오늘의 분석 횟수를 모두 사용했습니다. 자정에 초기화됩니다.' }
      }
      return { success: false, code: err.code, error: err.message }
    }
    return { success: false, code: 'INTERNAL_ERROR', error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  }
}
