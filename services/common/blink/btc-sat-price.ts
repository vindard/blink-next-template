import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import BigNumber from "bignumber.js";

import { fetchBtcSatPrice } from "./queries";
import { BtcSatPriceQuery } from "./generated";
import { BlinkError } from "./errors";

const priceOfOneBtcInTtdFromPriceOfOneSatInMinorUnit = (
  price: BtcSatPriceQuery["realtimePrice"]["btcSatPrice"]
): BigNumber => {
  const base = BigNumber(price.base);
  const priceOfOneSatInTtdCents = base.dividedBy(
    new BigNumber(10).pow(price.offset)
  );
  const priceOfOneBtcInTtdCents = priceOfOneSatInTtdCents.multipliedBy(
    new BigNumber(10).pow(8)
  );
  const priceOfOneBtcInTtd = priceOfOneBtcInTtdCents.dividedBy(
    new BigNumber(10).pow(2)
  );
  return priceOfOneBtcInTtd;
};

const priceOfOneSatInTtdFromPriceOfOneSatInMinorUnit = (
  price: BtcSatPriceQuery["realtimePrice"]["btcSatPrice"]
): BigNumber => {
  const base = BigNumber(price.base);
  const priceOfOneSatInTtdCents = base.dividedBy(
    new BigNumber(10).pow(price.offset)
  );
  const priceOfOneBtcInTtd = priceOfOneSatInTtdCents.dividedBy(
    new BigNumber(10).pow(2)
  );
  return priceOfOneBtcInTtd;
};

const priceOfOneUsdInTtdFromPriceOfOneUsdCentInMinorUnit = (
  price: BtcSatPriceQuery["realtimePrice"]["usdCentPrice"]
): BigNumber => {
  const base = BigNumber(price.base);
  const priceOfOneUsd = base.dividedBy(new BigNumber(10).pow(price.offset));
  return priceOfOneUsd;
};

const priceOfOneBtcInUsd = (
  price: BtcSatPriceQuery["realtimePrice"]
): BigNumber => {
  const priceOfOneBtcInTtd = priceOfOneBtcInTtdFromPriceOfOneSatInMinorUnit(
    price.btcSatPrice
  );
  const priceOfOneUsdInTtd = priceOfOneUsdInTtdFromPriceOfOneUsdCentInMinorUnit(
    price.usdCentPrice
  );

  return new BigNumber(
    priceOfOneBtcInTtd.dividedBy(priceOfOneUsdInTtd).toPrecision(12)
  );
};

const btcSatPriceInTtd = async (
  client: ApolloClient<NormalizedCacheObject>
): Promise<
  | {
      priceOfOneBtcInTtd: string;
      priceOfOneSatInTtd: string;
      priceOfOneUsdInTtd: string;
      priceOfOneBtcInUsd: string;
    }
  | BlinkError
> => {
  const realtimePriceInTtd = await fetchBtcSatPrice({
    client,
    currency: "TTD",
  });
  if (realtimePriceInTtd instanceof Error) {
    return realtimePriceInTtd;
  }

  return {
    priceOfOneBtcInTtd: priceOfOneBtcInTtdFromPriceOfOneSatInMinorUnit(
      realtimePriceInTtd.btcSatPrice
    ).toString(),
    priceOfOneSatInTtd: priceOfOneSatInTtdFromPriceOfOneSatInMinorUnit(
      realtimePriceInTtd.btcSatPrice
    ).toString(),
    priceOfOneUsdInTtd: priceOfOneUsdInTtdFromPriceOfOneUsdCentInMinorUnit(
      realtimePriceInTtd.usdCentPrice
    ).toString(),
    priceOfOneBtcInUsd: priceOfOneBtcInUsd(realtimePriceInTtd).toString(),
  };
};

export { btcSatPriceInTtd };
