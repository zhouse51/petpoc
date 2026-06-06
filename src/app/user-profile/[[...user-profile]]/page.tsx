import Link from "next/link";
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";

import { UserProfileMetadataFields } from "@/app/_components/user-profile-metadata-fields";

export default function UserProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back
        </Link>
      </div>
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
