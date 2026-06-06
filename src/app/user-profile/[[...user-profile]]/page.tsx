import { UserProfile } from "@clerk/nextjs";

import { UserProfileMetadataFields } from "@/app/_components/user-profile-metadata-fields";

export default function UserProfilePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full max-w-4xl",
            cardBox: "rounded-md shadow-sm",
            profileSectionPrimaryButton__username: "!hidden",
          },
        }}
      />
      <UserProfileMetadataFields />
    </main>
  );
}
