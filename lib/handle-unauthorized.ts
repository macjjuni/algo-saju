"use client"

import { signIn } from "next-auth/react"

interface FailedResult {
  success: false
  code: string
  error: string
}

type SuccessResult = { success: true } & Record<string, unknown>

type ActionResultLike = SuccessResult | FailedResult

/**
 * 서버 액션을 실행하고, UNAUTHORIZED 응답 시 자동으로 Google 재로그인을 트리거한다.
 * 정상 결과 또는 UNAUTHORIZED 외 에러는 그대로 반환한다.
 */
export async function safeAction<R extends ActionResultLike, A extends unknown[]>(
  action: (...args: A) => Promise<R>,
  ...args: A
): Promise<R> {
  const result = await action(...args)
  if (!result.success && result.code === "UNAUTHORIZED") {
    signIn("google")
  }
  return result
}
