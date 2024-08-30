import { DomainError } from "@/domain/errors";

export class BlinkError extends DomainError {}
export class CouldNotFetchPrice extends BlinkError {}
export class UnknownFetchPriceError extends BlinkError {}
