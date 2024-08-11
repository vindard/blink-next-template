import { NextApiRequest, NextApiResponse } from "next";
import { lnInvoicePaymentSend } from "@/services/graphql/mutations/ln-invoice-payment-send";
import {
  LnInvoicePaymentInput,
  LnInvoicePaymentSendMutation,
} from "@/services/graphql/generated";

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

  try {
    const { paymentRequest, memo, walletId }: LnInvoicePaymentInput = req.body;

    if (!paymentRequest || !walletId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await lnInvoicePaymentSend({
      paymentRequest,
      memo,
      walletId,
    });

    if (result instanceof Error) {
      return res.status(500).json({ error: result.message });
    }

    return res.status(200).json(result.lnInvoicePaymentSend);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
