"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { useAuth } from "@clerk/nextjs";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { CreditCard, Plus, Trash2 } from "lucide-react";

import type {
  PaymentMethodResponse,
  PaymentMethodsResponse,
  SetupIntentResponse,
} from "@/models/payment-methods";
import { Button } from "@/app/_components/ui/button";

type PaymentMethodsState =
  | { status: "idle" | "loading"; error?: undefined }
  | { status: "error"; error: string };

type AddCardFormProps = {
  clientSecret: string;
  onCancel: () => void;
  onSaved: () => Promise<void>;
};

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const getPaymentBrandLabel = (brand: string): string => {
  const normalizedBrand = brand.toLowerCase().replaceAll("_", " ");

  if (normalizedBrand === "amex") return "American Express";
  if (normalizedBrand === "diners") return "Diners Club";
  if (normalizedBrand === "mastercard") return "Mastercard";
  if (normalizedBrand === "unionpay") return "UnionPay";

  return normalizedBrand
    .split(" ")
    .map((word): string => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const PaymentBrandLogo = ({ brand }: { brand: string }): ReactElement => {
  const normalizedBrand = brand.toLowerCase();
  const label = getPaymentBrandLabel(brand);
  const baseClassName = "h-8 w-12 shrink-0 rounded border bg-white shadow-sm";

  if (normalizedBrand === "visa") {
    return (
      <svg
        aria-label={label}
        className={baseClassName}
        role="img"
        viewBox="0 0 48 32"
      >
        <rect fill="#ffffff" height="32" rx="3" width="48" />
        <text
          fill="#1434cb"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="13"
          fontStyle="italic"
          fontWeight="700"
          x="8"
          y="20"
        >
          VISA
        </text>
      </svg>
    );
  }

  if (normalizedBrand === "mastercard") {
    return (
      <svg
        aria-label={label}
        className={baseClassName}
        role="img"
        viewBox="0 0 48 32"
      >
        <rect fill="#ffffff" height="32" rx="3" width="48" />
        <circle cx="20" cy="16" fill="#eb001b" r="9" />
        <circle cx="28" cy="16" fill="#f79e1b" opacity="0.9" r="9" />
      </svg>
    );
  }

  if (normalizedBrand === "amex") {
    return (
      <svg
        aria-label={label}
        className={baseClassName}
        role="img"
        viewBox="0 0 48 32"
      >
        <rect fill="#2e77bb" height="32" rx="3" width="48" />
        <text
          fill="#ffffff"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="10"
          fontWeight="700"
          x="9"
          y="20"
        >
          AMEX
        </text>
      </svg>
    );
  }

  if (normalizedBrand === "discover") {
    return (
      <svg
        aria-label={label}
        className={baseClassName}
        role="img"
        viewBox="0 0 48 32"
      >
        <rect fill="#ffffff" height="32" rx="3" width="48" />
        <rect fill="#f58220" height="5" width="48" y="22" />
        <text
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="8"
          fontWeight="700"
          x="5"
          y="17"
        >
          DISCOVER
        </text>
      </svg>
    );
  }

  if (["diners", "jcb", "unionpay"].includes(normalizedBrand)) {
    return (
      <svg
        aria-label={label}
        className={baseClassName}
        role="img"
        viewBox="0 0 48 32"
      >
        <rect fill="#ffffff" height="32" rx="3" width="48" />
        <text
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={normalizedBrand === "unionpay" ? "7" : "10"}
          fontWeight="700"
          textAnchor="middle"
          x="24"
          y="19"
        >
          {label.toUpperCase()}
        </text>
      </svg>
    );
  }

  return (
    <span
      aria-label={label}
      className="flex h-8 w-12 shrink-0 items-center justify-center rounded border bg-white shadow-sm"
      role="img"
    >
      <CreditCard aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
    </span>
  );
};

const AddCardForm = ({
  clientSecret,
  onCancel,
  onSaved,
}: AddCardFormProps): ReactElement => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!stripe || !elements || isSaving) return;

    const card = elements.getElement(CardElement);

    if (!card) {
      setError("Card details are not ready.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        throw new Error(result.error.message ?? "Unable to add card.");
      }

      await onSaved();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to add card.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
      <div className="rounded-md border bg-background p-3">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: "#191816",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "14px",
                "::placeholder": {
                  color: "#62685f",
                },
              },
            },
          }}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={!stripe || isSaving} type="submit">
          <CreditCard aria-hidden="true" className="h-4 w-4" />
          {isSaving ? "Adding..." : "Add card"}
        </Button>
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export const PaymentMethodsPanel = (): ReactElement => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [state, setState] = useState<PaymentMethodsState>({ status: "idle" });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPreparingCardForm, setIsPreparingCardForm] = useState<boolean>(false);
  const [removingPaymentMethodId, setRemovingPaymentMethodId] = useState<string | null>(
    null,
  );

  const stripeOptions = useMemo((): { clientSecret: string } | undefined => {
    if (!clientSecret) return undefined;

    return { clientSecret };
  }, [clientSecret]);

  const loadPaymentMethods = useCallback(async (): Promise<void> => {
    if (!isLoaded || !isSignedIn) return;

    setState({ status: "loading" });

    try {
      const token = await getToken();
      const response = await fetch("/api/v1/payment-methods", {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const body = await response.json().catch((): Record<string, never> => ({}));
        throw new Error(
          body.error ?? `Payment methods failed with ${response.status}`,
        );
      }

      const data = (await response.json()) as PaymentMethodsResponse;
      setPaymentMethods(data.paymentMethods);
      setState({ status: "idle" });
    } catch (caughtError) {
      setState({
        status: "error",
        error:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load payment methods.",
      });
    }
  }, [getToken, isLoaded, isSignedIn]);

  const prepareCardForm = useCallback(async (): Promise<void> => {
    if (!stripePromise || isPreparingCardForm) return;

    setIsPreparingCardForm(true);
    setState({ status: "idle" });

    try {
      const token = await getToken();
      const response = await fetch("/api/v1/payment-methods/setup-intent", {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const body = await response.json().catch((): Record<string, never> => ({}));
        throw new Error(body.error ?? `Setup failed with ${response.status}`);
      }

      const data = (await response.json()) as SetupIntentResponse;
      setClientSecret(data.clientSecret);
    } catch (caughtError) {
      setState({
        status: "error",
        error:
          caughtError instanceof Error ? caughtError.message : "Unable to add card.",
      });
    } finally {
      setIsPreparingCardForm(false);
    }
  }, [getToken, isPreparingCardForm]);

  const removePaymentMethod = useCallback(
    async (paymentMethodId: string): Promise<void> => {
      if (removingPaymentMethodId) return;

      setRemovingPaymentMethodId(paymentMethodId);
      setState({ status: "idle" });

      try {
        const token = await getToken();
        const response = await fetch(
          `/api/v1/payment-methods/${encodeURIComponent(paymentMethodId)}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (!response.ok) {
          const body = await response
            .json()
            .catch((): Record<string, never> => ({}));
          throw new Error(body.error ?? `Remove failed with ${response.status}`);
        }

        setPaymentMethods((currentPaymentMethods): PaymentMethodResponse[] => {
          return currentPaymentMethods.filter((paymentMethod): boolean => {
            return paymentMethod.id !== paymentMethodId;
          });
        });
      } catch (caughtError) {
        setState({
          status: "error",
          error:
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to remove card.",
        });
      } finally {
        setRemovingPaymentMethodId(null);
      }
    },
    [getToken, removingPaymentMethodId],
  );

  const handleSavedCard = useCallback(async (): Promise<void> => {
    setClientSecret(null);
    await loadPaymentMethods();
  }, [loadPaymentMethods]);

  useEffect((): void => {
    void loadPaymentMethods();
  }, [loadPaymentMethods]);

  return (
    <section className="text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-normal">Payment Methods</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage saved credit cards.
          </p>
        </div>
        <Button
          disabled={!stripePromise || isPreparingCardForm || Boolean(clientSecret)}
          onClick={prepareCardForm}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          {isPreparingCardForm ? "Loading..." : "Add card"}
        </Button>
      </div>

      {!stripePromise ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required.
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {clientSecret && stripePromise && stripeOptions ? (
        <Elements options={stripeOptions} stripe={stripePromise as Promise<Stripe | null>}>
          <AddCardForm
            clientSecret={clientSecret}
            onCancel={(): void => setClientSecret(null)}
            onSaved={handleSavedCard}
          />
        </Elements>
      ) : null}

      <div className="mt-6 space-y-3">
        {state.status === "loading" ? (
          <p className="text-sm text-muted-foreground">Loading cards...</p>
        ) : null}
        {paymentMethods.length > 0
          ? paymentMethods.map(
              (paymentMethod): ReactElement => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background p-3"
                  key={paymentMethod.id}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <PaymentBrandLogo brand={paymentMethod.brand} />
                    <div className="min-w-0 text-sm">
                      <p className="truncate font-medium">
                        {getPaymentBrandLabel(paymentMethod.brand)} ending in{" "}
                        {paymentMethod.last4}
                      </p>
                      <p className="text-muted-foreground">
                        Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                      </p>
                    </div>
                  </div>
                  <Button
                    aria-label={`Remove card ending in ${paymentMethod.last4}`}
                    disabled={removingPaymentMethodId === paymentMethod.id}
                    onClick={(): void => {
                      void removePaymentMethod(paymentMethod.id);
                    }}
                    size="icon"
                    title="Remove card"
                    type="button"
                    variant="secondary"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              ),
            )
          : state.status !== "loading" && !clientSecret
            ? (
                <p className="text-sm text-muted-foreground">No saved cards.</p>
              )
            : null}
      </div>
    </section>
  );
};
