export { BlinkError } from "@/services/common/blink/errors";

import { BlinkError } from "@/services/common/blink/errors";

export class CouldNotPayViaLn extends BlinkError {}
export class CouldNotFetchUser extends BlinkError {}
export class CouldNotFindUsdWalletForUser extends BlinkError {}
export class TtdAmountNotValidNumber extends BlinkError {}

export class LnUrlPayError extends BlinkError {}
export class LnurlServiceError extends LnUrlPayError {}
export class ErrorFetchingLnurlInvoice extends LnUrlPayError {}
export class UnknownLnurlServiceError extends LnUrlPayError {}
