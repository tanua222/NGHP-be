import Logger from 'bunyan';
import { Response } from 'express';
import { X_REQUEST_TRACEID, X_SESSION_TRACEID } from './constants';
import log from './logger';
import { v1 as uuidv1 } from 'uuid';
interface IDictionary<TValue> {
  [id: string]: TValue;
}
export default class Context {
  private context: IDictionary<string>;

  log: Logger;
  constructor(ctx: IDictionary<string>, isLoggingContext: boolean, parentContext?: Context) {
    this.context = (parentContext && { ...parentContext.context, ...ctx }) || ctx;

    this.log = isLoggingContext ? (parentContext ? parentContext.log.child(ctx) : log.child(ctx)) : log;
  }
  child(additionalCtx: IDictionary<string>, isLoggingContext: boolean): Context {
    return new Context(additionalCtx, isLoggingContext, this);
  }
  add(additionalCtx: IDictionary<string>, isLoggingContext: boolean) {
    this.context = { ...this.context, ...additionalCtx };
    if (isLoggingContext) this.log = this.log.child(additionalCtx);
  }
  sessionId(): string {
    return this.context.sessionId;
  }
  get(contextParameter: string) {
    return this.context[contextParameter];
  }
  set(contextParameter: string, value: any) {
    return (this.context[contextParameter] = value);
  }
  get uuid(): string {
    return this.context.uuid;
  }
  get userId(): string {
    return this.context.userId;
  }
}

export const contextMiddleware = function (req: any, res: Response, next: any) {
  const sessionTraceId = req.headers[X_SESSION_TRACEID] || uuidv1();
  const requestTraceId = req.headers[X_REQUEST_TRACEID] || uuidv1();
  res.setHeader(X_SESSION_TRACEID, sessionTraceId);
  res.setHeader(X_REQUEST_TRACEID, requestTraceId);
  res.locals.context = new Context(
    {
      sessionId: req.session.id,
      sessionTraceId: sessionTraceId,
      requestTraceId: requestTraceId,
      url: String(req.originalUrl || ''),
      httpMethod: req.method,
    },
    true
  );
  next();
};
