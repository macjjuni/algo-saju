import ProfileForm from "@/components/profile/profile-form";

export const metadata = {
  title: "프로필 작성 - algo-saju",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">프로필 작성</h1>
        <ProfileForm />
      </div>
    </main>
  );
}
