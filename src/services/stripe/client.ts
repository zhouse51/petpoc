import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  stripe?: Stripe;
};

export const getStripe = (): Stripe => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required.");
  }

  globalForStripe.stripe = globalForStripe.stripe ?? new Stripe(secretKey);

  return globalForStripe.stripe;
};
