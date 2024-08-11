import { NextApiRequest, NextApiResponse } from "next";

import { fetchUserData } from "@/services/graphql/queries/me-data";
import { MeQuery } from "@/services/graphql/generated";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeQuery | { error: string }>
) {
  try {
    const response = await fetchUserData();
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}
