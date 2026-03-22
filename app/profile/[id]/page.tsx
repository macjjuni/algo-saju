import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfile } from "@/api/profile";
import ProfileFormPage from "@/components/feature/profile/profile-form-page";

export const metadata = {
  title: "프로필 수정",
};

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.backendToken) redirect("/login");

  const profile = await getProfile(session.backendToken, id);

  return (
    <ProfileFormPage
      title="프로필 수정"
      defaultValues={{
        ...profile,
        isLunar: profile.isLunar ?? false,
        isLeapMonth: profile.isLunar && profile.month < 0,
        month: Math.abs(profile.month),
        privacyConsent: true,
      }}
      profileId={id}
      submitLabel="수정하기"
    />
  );
}
