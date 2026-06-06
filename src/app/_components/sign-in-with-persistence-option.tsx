"use client";

import { useEffect, useRef } from "react";
import { SignIn } from "@clerk/nextjs";

const keepSignedInKey = "petpoc.keepSignedIn";
const optionId = "petpoc-keep-signed-in-option";

function updatePersistencePreference(keepSignedIn: boolean) {
  window.localStorage.setItem(keepSignedInKey, String(keepSignedIn));
}

function createOption() {
  const storedPreference = window.localStorage.getItem(keepSignedInKey);
  const keepSignedIn = storedPreference === null || storedPreference === "true";

  updatePersistencePreference(keepSignedIn);

  const wrapper = document.createElement("label");
  wrapper.id = optionId;
  wrapper.className =
    "mb-3 flex cursor-pointer items-center gap-3 text-sm font-medium text-[#191816]";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = keepSignedIn;
  checkbox.className = "h-4 w-4 rounded border-[#d8ddd2] accent-[#0f766e]";
  checkbox.addEventListener("change", () => {
    updatePersistencePreference(checkbox.checked);
  });

  const label = document.createElement("span");
  label.textContent = "Remember me!";

  wrapper.append(checkbox, label);
  return wrapper;
}

function insertPersistenceOption(root: HTMLDivElement) {
  if (root.querySelector(`#${optionId}`)) return;

  const buttons = Array.from(root.querySelectorAll("button"));
  const continueButton = buttons.find(
    (button) => button.textContent?.trim().toLowerCase() === "continue",
  );

  if (!continueButton?.parentElement) return;

  continueButton.parentElement.insertBefore(createOption(), continueButton);
}

export function SignInWithPersistenceOption() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    insertPersistenceOption(root);

    const observer = new MutationObserver(() => {
      insertPersistenceOption(root);
    });

    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            cardBox: "rounded-md shadow-sm",
          },
        }}
      />
    </div>
  );
}

export { keepSignedInKey };
