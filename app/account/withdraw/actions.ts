"use server";

import { auth, signOut } from "@/lib/auth";
import { deleteMe } from "@/api/auth";

export async function withdrawAction() {
  const session = await auth();
  if (!session?.backendToken) throw new Error("인증이 필요합니다.");

  await deleteMe(session.backendToken);
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
