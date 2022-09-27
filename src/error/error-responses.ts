import Context from '../utils/context';

export const errorResponse = (errorCode: any, appContext: Context, param?: any) => {
  return {
    // code: errorCode,
    traceId: appContext.sessionId(),
    ...errorCode,
    param,
    // ...ErrorMapping[errorCode as keyof typeof ErrorMapping],
  };
};
// module.exports = errorResponse;
