import { ApolloQueryResult, gql } from "@apollo/client";

import { MeDocument, MeQuery } from "@/services/common/blink/generated";

import { createApolloClient } from "../client";

gql`
  query Me {
    me {
      createdAt
      id
      language
      phone
      defaultAccount {
        defaultWalletId
        displayCurrency
        id
        level
        wallets {
          accountId
          balance
          id
          pendingIncomingBalance
          walletCurrency
        }
        callbackPortalUrl
      }
      totpEnabled
      username
      email {
        address
        verified
      }
    }
  }
`;

const fetchUserData = async (): Promise<ApolloQueryResult<MeQuery> | Error> => {
  const client = createApolloClient();
  try {
    const data = await client.query<MeQuery>({
      query: MeDocument,
    });
    return data;
  } catch (err) {
    return err instanceof Error ? err : new Error("Unknown error in Me query");
  }
};

export { fetchUserData };
