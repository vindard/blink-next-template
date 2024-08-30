import { createApolloClient } from "../client";

import { btcSatPriceInTtd } from "@/services/common/blink/queries";

const clientBtcSatPriceInTtd = async (): Promise<
  | {
      priceOfOneBtcInTtd: string;
      priceOfOneUsdInTtd: string;
      priceOfOneBtcInUsd: string;
    }
  | Error
> => btcSatPriceInTtd(createApolloClient());

export { clientBtcSatPriceInTtd as btcSatPriceInTtd };
