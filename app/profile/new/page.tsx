import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfiles } from "@/api/profile";
import ProfileFormPage from "@/components/feature/profile/profile-form-page";

const MAX_PROFILES = 10;

export const metadata = {
  title: "프로필 작성",
};

export default async function NewProfilePage() {
  const session = await auth();
  const profiles = await getProfiles(session!.backendToken!);

  if (profiles.length >= MAX_PROFILES) {
    redirect("/profile");
  }

  return <ProfileFormPage title="프로필 작성" />;
}
