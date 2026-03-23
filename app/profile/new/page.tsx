import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfiles } from "@/services/profile";
import { MAX_PROFILES } from "@/lib/constants";
import ProfileFormPage from "@/components/feature/profile/profile-form-page";

export const metadata = {
  title: "프로필 작성",
};

export default async function NewProfilePage() {
  const session = await auth();
  if (!session?.backendToken) redirect("/login");

  const profiles = await getProfiles(session.backendToken);

  if (profiles.length >= MAX_PROFILES) {
    redirect("/profile");
  }

  return <ProfileFormPage title="프로필 작성" />;
}
