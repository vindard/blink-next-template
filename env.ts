import { createEnv } from "@t3-oss/env-nextjs";

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export const env = createEnv({
  server: {
    CORE_URL: z.string().default("http://localhost:4455/graphql"),
    API_TOKEN: z.string().default(""),
  },
  client: {
    NEXT_PUBLIC_BLINK_HTTP_ENDPOINT: z
      .string()
      .default("http://localhost:4455/graphql"),
  },
  runtimeEnv: {
    CORE_URL: process.env.CORE_URL,
    API_TOKEN: process.env.API_TOKEN,
    NEXT_PUBLIC_BLINK_HTTP_ENDPOINT:
      process.env.NEXT_PUBLIC_BLINK_HTTP_ENDPOINT,
  },
});
