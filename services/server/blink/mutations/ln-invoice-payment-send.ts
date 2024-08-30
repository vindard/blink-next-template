import { gql } from "@apollo/client";

import {
  LnInvoicePaymentInput,
  LnInvoicePaymentSendDocument,
  LnInvoicePaymentSendMutation,
} from "@/services/common/blink/generated";

import { createApolloClient } from "../client";

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

const lnInvoicePaymentSend = async ({
  walletId,
  paymentRequest,
  memo,
}: LnInvoicePaymentInput): Promise<LnInvoicePaymentSendMutation | Error> => {
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
  } catch (err) {
    return err instanceof Error
      ? err
      : new Error("Unknown error in LnInvoicePaymentSend mutation");
  }
};

export { lnInvoicePaymentSend };
