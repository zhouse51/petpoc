import type { NextResponse } from "next/server";

import { handlePaymentMethodDelete } from "@/services/payment-methods/handler";

type RouteContext = {
  params: Promise<{
    paymentMethodId: string;
  }>;
};

export const DELETE = async (
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> => {
  const { paymentMethodId } = await context.params;

  return handlePaymentMethodDelete(paymentMethodId);
};
