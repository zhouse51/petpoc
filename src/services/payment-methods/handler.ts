import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import type {
  PaymentMethodResponse,
  PaymentMethodsResponse,
  SetupIntentResponse,
} from "@/models/payment-methods";
import {
  getAppUserByClerkId,
  updateAppUserStripeCustomerId,
  upsertAppUser,
} from "@/services/repositories/app-users";
import { getStripe } from "@/services/stripe/client";

type AppUser = NonNullable<Awaited<ReturnType<typeof getAppUserByClerkId>>>;

const getAuthenticatedAppUser = async (): Promise<AppUser | null> => {
  const { isAuthenticated, userId } = await auth({
    acceptsToken: "session_token",
  });

  if (!isAuthenticated || !userId) {
    return null;
  }

  const clerkUser = await currentUser();
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    "Signed-in user";
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses.at(0)?.emailAddress;

  return upsertAppUser({
    clerkUserId: userId,
    email,
    name,
  });
};

const getOrCreateStripeCustomerId = async (user: AppUser): Promise<string> => {
  if (user.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    metadata: {
      appUserId: user.id,
      clerkUserId: user.auth_user_id,
    },
    name: user.name,
  });

  await updateAppUserStripeCustomerId(user.id, customer.id);

  return customer.id;
};

const serializePaymentMethod = (
  paymentMethod: Stripe.PaymentMethod,
): PaymentMethodResponse | null => {
  if (!paymentMethod.card) return null;

  return {
    id: paymentMethod.id,
    brand: paymentMethod.card.brand,
    last4: paymentMethod.card.last4,
    expMonth: paymentMethod.card.exp_month,
    expYear: paymentMethod.card.exp_year,
  };
};

export const handlePaymentMethodsGet = async (): Promise<NextResponse> => {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.stripe_customer_id) {
    const emptyResponse: PaymentMethodsResponse = {
      paymentMethods: [],
    };

    return NextResponse.json(emptyResponse);
  }

  const stripe = getStripe();
  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripe_customer_id,
    type: "card",
  });
  const response: PaymentMethodsResponse = {
    paymentMethods: paymentMethods.data
      .map(serializePaymentMethod)
      .filter((paymentMethod): paymentMethod is PaymentMethodResponse => {
        return paymentMethod !== null;
      }),
  };

  return NextResponse.json(response);
};

export const handlePaymentMethodsSetupIntentPost =
  async (): Promise<NextResponse> => {
    const user = await getAuthenticatedAppUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomerId(user);
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    if (!setupIntent.client_secret) {
      return NextResponse.json(
        { error: "Unable to create setup intent" },
        { status: 500 },
      );
    }

    const response: SetupIntentResponse = {
      clientSecret: setupIntent.client_secret,
    };

    return NextResponse.json(response, { status: 201 });
  };

export const handlePaymentMethodDelete = async (
  paymentMethodId: string,
): Promise<NextResponse> => {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.stripe_customer_id) {
    return NextResponse.json({ error: "Payment method not found" }, { status: 404 });
  }

  const stripe = getStripe();
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  const paymentMethodCustomerId =
    typeof paymentMethod.customer === "string"
      ? paymentMethod.customer
      : paymentMethod.customer?.id;

  if (paymentMethodCustomerId !== user.stripe_customer_id) {
    return NextResponse.json({ error: "Payment method not found" }, { status: 404 });
  }

  await stripe.paymentMethods.detach(paymentMethodId);

  return new NextResponse(null, { status: 204 });
};
