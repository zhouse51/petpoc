"use client";

import { UserButton } from "@clerk/nextjs";
import { WandSparkles } from "lucide-react";

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
          userButtonPopoverFooter: "!hidden",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Action label="manageAccount" />
        <UserButton.Action
          label="Do whatever Brian wants"
          labelIcon={<WandSparkles aria-hidden="true" className="h-4 w-4" />}
          onClick={() => undefined}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
