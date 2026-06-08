"use client";

import type { ReactElement } from "react";
import { UserProfile } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { PaymentMethodsPanel } from "@/app/_components/payment-methods-panel";

export const UserProfilePanel = (): ReactElement => {
  return (
    <UserProfile
      appearance={{
        elements: {
          rootBox: "w-full max-w-4xl",
          cardBox: "rounded-md shadow-sm",
          profileSectionPrimaryButton__username: "!hidden",
        },
      }}
    >
      <UserProfile.Page label="account" />
      <UserProfile.Page label="security" />
      <UserProfile.Page
        label="Payment Methods"
        labelIcon={<CreditCard aria-hidden="true" className="h-4 w-4" />}
        url="payment"
      >
        <PaymentMethodsPanel />
      </UserProfile.Page>
    </UserProfile>
  );
};
