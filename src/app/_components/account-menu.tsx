"use client";

import { UserButton } from "@clerk/nextjs";

export function AccountMenu() {
  return (
    <UserButton
      userProfileMode="navigation"
      userProfileUrl="/user-profile"
      appearance={{
        elements: {
          avatarBox: "h-10 w-10",
          userButtonPopoverCard: "rounded-md shadow-lg",
          userButtonPopoverActionButton: "rounded-md",
        },
      }}
    />
  );
}
