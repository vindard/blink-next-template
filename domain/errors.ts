export const parseErrorMessageFromUnknown = (error: unknown): string => {
  const errMsg =
    error instanceof Error
      ? error.message
        ? error.message
        : error.name
      : typeof error === "string"
      ? error
      : error instanceof Object
      ? JSON.stringify(error)
      : "Unknown error";
  return errMsg;
};

export const parseErrorFromUnknown = (error: unknown): Error => {
  const err =
    error instanceof Error
      ? error
      : typeof error === "string"
      ? new Error(error)
      : error instanceof Object
      ? new Error(JSON.stringify(error))
      : new Error("Unknown error");
  return err;
};

export const ErrorLevel = {
  Info: "info",
  Warn: "warn",
  Critical: "critical",
} as const;

export class DomainError extends Error {
  name: string;
  level?: ErrorLevel;
  constructor(message?: string | unknown | Error) {
    super(parseErrorMessageFromUnknown(message));
    this.name = this.constructor.name;
    this.level = ErrorLevel.Info;
  }
}

export class CouldNotParseInt extends DomainError {}
