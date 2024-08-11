import { gql } from "@apollo/client";

import {
  LnInvoicePaymentInput,
  LnInvoicePaymentSendDocument,
  LnInvoicePaymentSendMutation,
} from "@/services/graphql/generated";
import { createApolloClient } from "..";

gql`
  mutation LnInvoicePaymentSend($input: LnInvoicePaymentInput!) {
    lnInvoicePaymentSend(input: $input) {
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

export async function lnInvoicePaymentSend({
  paymentRequest,
  memo,
  walletId,
}: LnInvoicePaymentInput): Promise<Error | LnInvoicePaymentSendMutation> {
  const client = createApolloClient();
  try {
    const { data } = await client.mutate<LnInvoicePaymentSendMutation>({
      mutation: LnInvoicePaymentSendDocument,
      variables: {
        input: {
          walletId,
          paymentRequest,
          memo,
        },
      },
    });

    if (!data) {
      return new Error("No data returned from LnInvoicePaymentSendMutation");
    }

    return data;
  } catch (error) {
    console.error("Error in LnInvoicePaymentSend ", error);
    if (error instanceof Error) {
      return new Error(error.message);
    } else {
      console.error("Unknown Error in LnInvoicePaymentSend");
      return new Error("Unknown error");
    }
  }
}
