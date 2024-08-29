import { NextApiRequest, NextApiResponse } from "next";
import { lnInvoicePaymentSend } from "@/services/server/blink/mutations/ln-invoice-payment-send";
import {
  LnInvoicePaymentInput,
  LnInvoicePaymentSendMutation,
} from "@/services/server/blink/generated";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    LnInvoicePaymentSendMutation["lnInvoicePaymentSend"] | { error: string }
  >
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { walletId, paymentRequest, memo }: LnInvoicePaymentInput = req.body;

  if (!walletId || !paymentRequest) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await lnInvoicePaymentSend({
    walletId,
    paymentRequest,
    memo,
  });

  if (result instanceof Error) {
    console.error("Error executing payment send operation:", result);
    return res.status(500).json({ error: result.message });
  }

  return res.status(200).json(result.lnInvoicePaymentSend);
}
