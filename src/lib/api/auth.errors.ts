export class SessionExpiredError extends Error {
  code = "SESSION_EXPIRED";

  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}
