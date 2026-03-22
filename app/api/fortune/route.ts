import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ApiError } from '@/lib/api-client'
import { requestFortuneStream } from '@/api/fortune'
import { buildChartData } from '@/lib/build-chart-data'
import { decrypt } from '@/lib/crypto'
import type { BirthForm } from '@/lib/types'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.backendToken) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { encryptedData, templateId } = await request.json() as { encryptedData: string; templateId: number }

  let birthForms: BirthForm[]
  try {
    const decrypted = await decrypt(encryptedData)
    birthForms = JSON.parse(decrypted) as BirthForm[]
  } catch {
    return NextResponse.json({ code: 'INTERNAL_ERROR', message: '데이터 복호화에 실패했습니다.' }, { status: 400 })
  }

  const chartDataParts = await Promise.all(birthForms.map((form) => buildChartData(form)))
  const chartData = chartDataParts.join('\n\n')

  let backendRes: Response
  try {
    backendRes = await requestFortuneStream(session.backendToken, { chartData, promptTemplateId: templateId })
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ code: err.code, message: err.message }, { status: err.status || 500 })
    }
    return NextResponse.json({ code: 'INTERNAL_ERROR', message: '분석 중 오류가 발생했습니다.' }, { status: 500 })
  }

  if (!backendRes.body) {
    return NextResponse.json({ code: 'INTERNAL_ERROR', message: '스트림 응답이 없습니다.' }, { status: 500 })
  }

  return new Response(backendRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
