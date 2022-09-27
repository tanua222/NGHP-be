export default class Error {
  code?: string;
  reason: string;
  message?: string;
  exceptionText?: string;
  param?: any;

  constructor(code: string, reason: string, message: string) {
    this.code = code;
    this.reason = reason;
    this.message = message;
  }

  static badRequestError(message?: string) {
    return new Error('BAD_REQUEST', `Bad request error`, message || 'Notify application support team');
  }

  static internalError(message?: string) {
    return new Error('INTERNAL_SERVER', `Internal server error`, message || 'Notify application support team');
  }
}
