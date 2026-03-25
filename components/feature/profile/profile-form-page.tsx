'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createProfileAction, updateProfileAction } from '@/app/profile/actions'
import { safeAction } from '@/lib/handle-unauthorized'
import type { CreateProfileRequest } from '@/services/profile'
import type { BirthFormValues } from '@/lib/schema'
import ProfileForm from './profile-form'

interface ProfileFormPageProps {
  title: string;
  defaultValues?: Partial<BirthFormValues>;
  profileId?: string;
  submitLabel?: string;
}

export default function ProfileFormPage({ title, defaultValues, profileId, submitLabel }: ProfileFormPageProps) {
  // region [Hooks]
  const router = useRouter()
  // endregion

  // region [Events]
  async function onSubmit(data: CreateProfileRequest) {
    const res = profileId
      ? await safeAction(updateProfileAction, profileId, data)
      : await safeAction(createProfileAction, data)

    if (!res.success) {
      toast.error(res.error)
      return
    }
    router.push('/profile')
  }

  // endregion

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="mb-6 text-center text-2xl font-bold">{title}</h1>
      <ProfileForm defaultValues={defaultValues} onSubmit={onSubmit} submitLabel={submitLabel} hidePrivacyConsent={!!profileId}/>
    </div>
  )
}
