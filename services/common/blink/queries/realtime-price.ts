import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import BigNumber from "bignumber.js";

import { BtcSatPriceDocument, BtcSatPriceQuery } from "../generated";

gql`
  query BtcSatPrice($currency: DisplayCurrency) {
    realtimePrice(currency: $currency) {
      id
      timestamp
      btcSatPrice {
        base
        offset
      }
      usdCentPrice {
        base
        offset
      }
      denominatorCurrencyDetails {
        id
        fractionDigits
        name
        symbol
        flag
      }
    }
  }
`;

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
      priceOfOneUsdInTtd: string;
      priceOfOneBtcInUsd: string;
    }
  | Error
> => {
  try {
    const { data } = await client.query<BtcSatPriceQuery>({
      query: BtcSatPriceDocument,
      variables: { currency: "TTD" },
    });

    if (!data) {
      return new Error("No data returned from BtcSatPriceQuery");
    }

    const { realtimePrice } = data;
    return {
      priceOfOneBtcInTtd: priceOfOneBtcInTtdFromPriceOfOneSatInMinorUnit(
        realtimePrice.btcSatPrice
      ).toString(),
      priceOfOneUsdInTtd: priceOfOneUsdInTtdFromPriceOfOneUsdCentInMinorUnit(
        realtimePrice.usdCentPrice
      ).toString(),
      priceOfOneBtcInUsd: priceOfOneBtcInUsd(realtimePrice).toString(),
    };
  } catch (err) {
    return err instanceof Error
      ? err
      : new Error("Unknown error in BtcSatPrice query");
  }
};

export { btcSatPriceInTtd };
