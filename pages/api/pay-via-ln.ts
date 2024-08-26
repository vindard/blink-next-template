import { NextApiRequest, NextApiResponse } from "next";
import { lnurlPaymentSend } from "@/services/server/blink/mutations/ln-url-payment-send";
import {
  LnurlPaymentSendInput,
  LnurlPaymentSendMutation,
} from "@/services/server/blink/generated";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    LnurlPaymentSendMutation["lnurlPaymentSend"] | { error: string }
  >
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { lnurl, amount, walletId }: LnurlPaymentSendInput = req.body;

  if (!lnurl || !amount || !walletId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await lnurlPaymentSend({
    lnurl,
    amount,
    walletId,
  });

  if (result instanceof Error) {
    console.error("Error executing payment send operation:", result);
    return res.status(500).json({ error: result.message });
  }

  return res.status(200).json(result.lnurlPaymentSend);
}
