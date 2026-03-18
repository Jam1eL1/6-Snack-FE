export class SessionExpiredError extends Error {
  code = "SESSION_EXPIRED";

  constructor(message = "Your session has expired. Please log in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}
