class AnError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg) {
    return new AnError(400, msg);
  }
  static notAuth(msg) {
    return new AnError(401, msg);
  }
  static notFound(msg) {
    return new AnError(404, msg);
  }
  static internalError(msg) {
    return new AnError(500, msg);
  }
}

module.exports = AnError;
