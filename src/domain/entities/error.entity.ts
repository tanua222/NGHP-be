export class BadRequestError extends Error {
  code: any;

  constructor(code: any, message?: string) {
    super(message);
    this.code = code;
  }
}

export class UnAuthorizedError extends Error {
  code: any;

  constructor(code: any, message?: string) {
    super(message);
    this.code = code;
  }
}
