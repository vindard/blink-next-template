import { NextApiRequest, NextApiResponse } from "next";

import { fetchUserData } from "@/services/blink/queries/me-data";
import { MeQuery } from "@/services/blink/generated";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeQuery | { error: string }>
) {
  const response = await fetchUserData();
  if (response instanceof Error) {
    console.error("Error fetching user data:", response);
    return res.status(500).json({ error: "Failed to fetch user data" });
  }
  return res.status(200).json(response.data);
}
