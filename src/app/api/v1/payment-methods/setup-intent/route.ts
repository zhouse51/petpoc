import type { NextResponse } from "next/server";

import { handlePaymentMethodsSetupIntentPost } from "@/services/payment-methods/handler";

export const POST = async (): Promise<NextResponse> => {
  return handlePaymentMethodsSetupIntentPost();
};
