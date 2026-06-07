"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState, type ReactElement } from "react";
import { SignUp } from "@clerk/nextjs";

import { Button } from "@/app/_components/ui/button";

const signUpAgreementKey = "petpoc.signUpAgreement.v1";

const hasAcceptedAgreement = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.sessionStorage.getItem(signUpAgreementKey) === "true";
};

export const SignUpAgreement = (): ReactElement => {
  const [accepted, setAccepted] = useState(false);
  const [canContinue, setCanContinue] = useState(hasAcceptedAgreement);

  const continueToSignUp = (): void => {
    window.sessionStorage.setItem(signUpAgreementKey, "true");
    setCanContinue(true);
  };

  if (canContinue) {
    return (
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            cardBox: "rounded-md shadow-sm",
          },
        }}
      />
    );
  }

  return (
    <section className="w-full max-w-md rounded-md border bg-card p-6 text-card-foreground shadow-sm">
      <h1 className="text-xl font-semibold tracking-normal">Before you create an account</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Please review and accept the PetPOC terms before continuing to registration.
      </p>

      <div className="mt-5 max-h-48 overflow-auto rounded-md border bg-muted p-4 text-sm leading-6">
        <p>
          Welcome! By creating an account and using our service, you agree to use it responsibly and respectfully. Please don&apos;t use the service for unlawful activities, attempt to disrupt its operation, or interfere with other users&apos; experience. In short: be kind, be fair, and help us keep the community enjoyable for everyone.

          You are responsible for maintaining the security of your account and any activity that occurs under it. Please provide accurate information when signing up and keep your login credentials secure. If you believe your account has been compromised, let us know as soon as possible.

          You retain ownership of any content you upload or create through the service. By using the service, you grant us permission to store, process, and display your content as necessary to provide the features and functionality of the platform. We will make reasonable efforts to protect your data, but no online service can guarantee absolute security or uninterrupted availability.

          We may update, improve, or modify the service from time to time. By continuing to use the service, you agree to any updated terms. If you do not agree with the changes, you may stop using the service and close your account at any time. Most importantly, have fun, be respectful, and enjoy using the service!
        </p>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm">
        <input
          checked={accepted}
          className="mt-1 h-4 w-4 rounded border-border accent-primary"
          onChange={(event): void => setAccepted(event.target.checked)}
          type="checkbox"
        />
        <span>I agree to the terms and want to continue registration.</span>
      </label>

      <Button
        className="mt-6 w-full"
        disabled={!accepted}
        onClick={continueToSignUp}
        type="button"
      >
        Continue
      </Button>
      <Button asChild className="mt-3 w-full" variant="ghost">
        <Link href={"/sign-in" as Route}>Back to login</Link>
      </Button>
    </section>
  );
};
