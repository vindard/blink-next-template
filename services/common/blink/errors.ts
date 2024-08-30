import { DomainError } from "@/domain";

export class BlinkError extends DomainError {}
export class CouldNotFetchPrice extends BlinkError {}
export class UnknownFetchPriceError extends BlinkError {}
