import { createApolloClient } from "./client";

import { btcSatPriceInTtd } from "@/services/common/blink";
import { BlinkError } from "@/services/common/blink/errors";

const clientBtcSatPriceInTtd = async (): Promise<
  | {
      priceOfOneBtcInTtd: string;
      priceOfOneUsdInTtd: string;
      priceOfOneBtcInUsd: string;
    }
  | BlinkError
> => btcSatPriceInTtd(createApolloClient());

export { clientBtcSatPriceInTtd as btcSatPriceInTtd };
