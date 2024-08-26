import { gql } from "@apollo/client";

import {
  LnurlPaymentSendInput,
  LnurlPaymentSendDocument,
  LnurlPaymentSendMutation,
} from "@/services/blink/generated";
import { createApolloClient } from "..";

gql`
  mutation LnurlPaymentSend($input: LnurlPaymentSendInput!) {
    lnurlPaymentSend(input: $input) {
      errors {
        message
      }
      status
      transaction {
        initiationVia {
          ... on InitiationViaLn {
            paymentHash
            paymentRequest
          }
        }
        settlementVia {
          ... on SettlementViaIntraLedger {
            preImage
          }
          ... on SettlementViaLn {
            preImage
          }
        }
      }
    }
  }
`;

const lnurlPaymentSend = async ({
  amount,
  lnurl,
  walletId,
}: LnurlPaymentSendInput): Promise<LnurlPaymentSendMutation | Error> => {
  const client = createApolloClient();
  try {
    const { data } = await client.mutate<LnurlPaymentSendMutation>({
      mutation: LnurlPaymentSendDocument,
      variables: {
        input: {
          walletId,
          lnurl,
          amount,
        },
      },
    });

    if (!data) {
      return new Error("No data returned from LnurlPaymentSendMutation");
    }

    return data;
  } catch (err) {
    return err instanceof Error
      ? err
      : new Error("Unknown error in LnurlPaymentSend mutation");
  }
};

export { lnurlPaymentSend };
