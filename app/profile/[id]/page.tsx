import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/profile-api";
import ProfileFormPage from "@/components/profile/profile-form-page";

export const metadata = {
  title: "프로필 수정 - algo-saju",
};

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.backendToken) redirect("/login");

  const profile = await getProfile(session.backendToken, id);

  return (
    <ProfileFormPage
      title="프로필 수정"
      defaultValues={profile}
      profileId={id}
      submitLabel="수정하기"
    />
  );
}
