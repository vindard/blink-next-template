import { gql } from "@apollo/client";

import {
  BtcSatPriceDocument,
  BtcSatPriceQuery,
  BtcSatPriceQueryVariables,
} from "@/services/common/blink/generated";

import { createApolloClient } from "../client";

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

const btcSatPrice = async (
  currency: BtcSatPriceQueryVariables
): Promise<BtcSatPriceQuery | Error> => {
  const client = createApolloClient();
  try {
    const { data } = await client.query<BtcSatPriceQuery>({
      query: BtcSatPriceDocument,
      variables: {
        currency,
      },
    });

    if (!data) {
      return new Error("No data returned from BtcSatPriceQuery");
    }

    return data;
  } catch (err) {
    return err instanceof Error
      ? err
      : new Error("Unknown error in BtcSatPrice query");
  }
};

export { btcSatPrice };
