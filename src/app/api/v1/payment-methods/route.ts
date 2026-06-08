import type { NextResponse } from "next/server";

import { handlePaymentMethodsGet } from "@/services/payment-methods/handler";

export const GET = async (): Promise<NextResponse> => {
  return handlePaymentMethodsGet();
};
