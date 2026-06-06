"use client";

import { useEffect, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/app/_components/ui/button";

const defaultAddress = "Chicago";
const defaultFavoriteColor = "Blue";

// Id of the host node we inject into Clerk's rendered DOM.
const hostId = "petpoc-profile-extras";

// Just-for-fun POC field — picks a random spirit animal, not persisted anywhere.
const spiritAnimals = [
  "🦊 Sneaky Fox",
  "🦦 Chaotic Otter",
  "🦥 Zen Sloth",
  "🦉 Wise Owl",
  "🐙 Galaxy-brain Octopus",
  "🦙 Unbothered Llama",
  "🦩 Extra Flamingo",
  "🐢 Deadline-proof Turtle",
];

const randomSpiritAnimal = (): string => {
  return spiritAnimals[Math.floor(Math.random() * spiritAnimals.length)];
};

type ProfileMetadata = {
  address?: string;
  favoriteColor?: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Finds Clerk's account page in the DOM and keeps a host <div> appended at the
 * bottom of it, so our custom fields render inside the profile section. Returns
 * the host node, or null when the account page isn't currently shown (e.g. the
 * user navigated to the Security tab) so the fields don't leak onto other pages.
 */
const useClerkAccountPageHost = (): HTMLElement | null => {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect((): () => void => {
    const sync = (): void => {
      const scrollBox =
        document.querySelector<HTMLElement>(".cl-pageScrollBox");
      // The Profile section only exists on the account page — use it to gate.
      const onAccountPage = scrollBox?.querySelector(
        ".cl-profileSection__profile",
      );

      if (!scrollBox || !onAccountPage) {
        setHost(null);
        return;
      }

      let node = scrollBox.querySelector<HTMLElement>(`#${hostId}`);
      if (!node) {
        node = document.createElement("div");
        node.id = hostId;
      }
      // Keep it as the last child so it sits at the bottom of the section.
      if (node !== scrollBox.lastElementChild) {
        scrollBox.append(node);
      }
      setHost(node);
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    return (): void => observer.disconnect();
  }, []);

  return host;
};

export const UserProfileMetadataFields = (): ReactElement | null => {
  const { isLoaded, user } = useUser();
  const host = useClerkAccountPageHost();
  const [address, setAddress] = useState(defaultAddress);
  const [favoriteColor, setFavoriteColor] = useState(defaultFavoriteColor);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [spiritAnimal, setSpiritAnimal] = useState(randomSpiritAnimal);

  useEffect((): void => {
    if (!isLoaded || !user) return;

    const metadata = user.unsafeMetadata as ProfileMetadata;
    setAddress(metadata.address ?? defaultAddress);
    setFavoriteColor(metadata.favoriteColor ?? defaultFavoriteColor);

    // Seed the defaults into Clerk metadata the first time they are missing so
    // the values are actually persisted ("Chicago" / "Blue"), not just shown.
    if (metadata.address === undefined || metadata.favoriteColor === undefined) {
      void user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          address: metadata.address ?? defaultAddress,
          favoriteColor: metadata.favoriteColor ?? defaultFavoriteColor,
        },
      });
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user || !host) return null;

  const activeUser = user;

  const handleSave = async (): Promise<void> => {
    setStatus("saving");
    try {
      await activeUser.update({
        unsafeMetadata: {
          ...activeUser.unsafeMetadata,
          address,
          favoriteColor,
        },
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const fields = (
    <section className="mt-2 border-t pt-6 text-card-foreground">
      <h2 className="text-base font-semibold tracking-normal">Additional details</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Stored on your Clerk profile.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Address</span>
          <input
            type="text"
            value={address}
            onChange={(event): void => {
              setAddress(event.target.value);
              setStatus("idle");
            }}
            className="h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Favorite Color</span>
          <input
            type="text"
            value={favoriteColor}
            onChange={(event): void => {
              setFavoriteColor(event.target.value);
              setStatus("idle");
            }}
            className="h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-dashed bg-muted p-4">
        <div className="text-sm">
          <span className="font-medium">Spirit Animal of the Day</span>
          <span className="ml-2 text-base">{spiritAnimal}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="default"
          className="ml-auto"
          onClick={(): void => setSpiritAnimal(randomSpiritAnimal())}
        >
          🎲 Reroll
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save"}
        </Button>
        {status === "saved" ? (
          <span className="text-sm text-muted-foreground">Saved</span>
        ) : null}
        {status === "error" ? (
          <span className="text-sm text-red-600">Could not save. Try again.</span>
        ) : null}
      </div>
    </section>
  );

  return createPortal(fields, host);
};
