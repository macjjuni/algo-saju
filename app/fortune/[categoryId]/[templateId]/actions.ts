"use server";

import { auth } from '@/lib/auth'
import { getProfile } from '@/api/profile'
import { requestFortune } from '@/api/fortune'
import { buildChartData } from '@/lib/build-chart-data'
import type { BirthForm } from '@/lib/types'

export async function analyzeFortuneAction(
  profileId: string,
  templateId: number
): Promise<{ result: string } | { error: string }> {
  const session = await auth()
  if (!session?.backendToken) return { error: '로그인이 필요합니다.' }

  const profile = await getProfile(session.backendToken, profileId)

  const birthForm: BirthForm = {
    year: profile.year,
    month: profile.month,
    day: profile.day,
    hour: profile.hour,
    minute: profile.minute,
    gender: profile.gender,
    unknownTime: profile.unknownTime,
    latitude: profile.latitude,
    longitude: profile.longitude,
    cityName: profile.cityName,
  }

  const chartData = await buildChartData(birthForm)
  const response = await requestFortune(session.backendToken, { chartData, promptTemplateId: templateId })

  return { result: response.result }
}
