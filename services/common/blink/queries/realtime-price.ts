import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";

import {
  BlinkError,
  CouldNotFetchPrice,
  UnknownFetchPriceError,
} from "../errors";
import {
  BtcSatPriceDocument,
  BtcSatPriceQuery,
  BtcSatPriceQueryResult,
  BtcSatPriceQueryVariables,
} from "../generated";

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

const fetchBtcSatPrice = async ({
  client,
  currency,
}: {
  client: ApolloClient<NormalizedCacheObject>;
  currency: BtcSatPriceQueryVariables["currency"];
}): Promise<BtcSatPriceQuery["realtimePrice"] | BlinkError> => {
  try {
    const { data } = await client.query<BtcSatPriceQuery>({
      query: BtcSatPriceDocument,
      variables: { currency },
    });

    if (!data) {
      return new CouldNotFetchPrice();
    }

    return data.realtimePrice;
  } catch (err) {
    return err instanceof Error
      ? new UnknownFetchPriceError(err.message)
      : new UnknownFetchPriceError(err);
  }
};

export { fetchBtcSatPrice };
