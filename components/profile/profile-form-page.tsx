"use client";

import { useRouter } from "next/navigation";
import { createProfileAction, updateProfileAction } from "@/app/profile/actions";
import type { CreateProfileRequest } from "@/lib/profile-api";
import type { BirthFormValues } from "@/lib/schema";
import GlassPanel from "@/components/ui/glass-panel";
import ProfileForm from "./profile-form";

interface ProfileFormPageProps {
  title: string;
  defaultValues?: Partial<BirthFormValues>;
  profileId?: string;
  submitLabel?: string;
}

export default function ProfileFormPage({ title, defaultValues, profileId, submitLabel }: ProfileFormPageProps) {
  // region [Hooks]
  const router = useRouter();
  // endregion

  // region [Events]
  async function onSubmit(data: CreateProfileRequest) {
    if (profileId) {
      await updateProfileAction(profileId, data);
    } else {
      await createProfileAction(data);
    }
    router.push("/profile");
  }
  // endregion

  return (
    <div className="mx-auto max-w-2xl py-8 px-4">
      <GlassPanel>
        <h1 className="mb-6 text-center text-2xl font-bold">{title}</h1>
        <ProfileForm defaultValues={defaultValues} onSubmit={onSubmit} submitLabel={submitLabel} />
      </GlassPanel>
    </div>
  );
}
