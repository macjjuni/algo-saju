"use client"

import { signIn } from "next-auth/react"

interface FailedResult {
  success: false
  code: string
}

/**
 * 서버 액션 결과가 UNAUTHORIZED이면 Google 재로그인을 트리거한다.
 * 재로그인이 트리거되면 true를 반환하므로 호출부에서 early return 가능.
 */
export function handleUnauthorized(result: FailedResult): boolean {
  if (result.code === "UNAUTHORIZED") {
    signIn("google")
    return true
  }
  return false
}
