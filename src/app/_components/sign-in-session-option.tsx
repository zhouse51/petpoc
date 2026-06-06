"use client";

import { useEffect, useState } from "react";

const storageKey = "petpoc.keepSignedIn";

export function SignInSessionOption() {
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  useEffect(() => {
    const storedPreference = window.localStorage.getItem(storageKey);
    if (storedPreference !== null) {
      setKeepSignedIn(storedPreference === "true");
    }
  }, []);

  function updatePreference(checked: boolean) {
    setKeepSignedIn(checked);
    window.localStorage.setItem(storageKey, String(checked));
  }

  return (
    <div className="mb-4 w-full rounded-md border bg-card p-4 shadow-sm">
      <label className="flex items-start gap-3 text-sm font-medium text-card-foreground">
        <input
          type="checkbox"
          checked={keepSignedIn}
          onChange={(event) => updatePreference(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
        />
        <span>Keep me signed in for 15 days</span>
      </label>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        Session duration is controlled by the app authentication settings.
      </p>
    </div>
  );
}
