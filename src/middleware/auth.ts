import { NextFunction, Request, Response } from 'express';
import Context from '../utils/context';
const jwt = require('jsonwebtoken');

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const context: Context = res.locals.context;
  context.log.debug('authentication triggered');

  try {
    const token = req.headers['x-access-token'] || req.headers['authorization']?.replace('Bearer ', '');
    context.log.debug('token:' + token);
    context.log.debug('JWT_SESSION_SECRET=' + process.env.JWT_SESSION_SECRET);

    if (token) {
      jwt.verify(token, process.env.JWT_SESSION_SECRET, async (err: any, decoded: any) => {
        if (err) {
          context.log.error('Error!' + err);
          return res.json({
            success: false,
            message: 'Invalid token. User is not logged in.',
          });
        } else {
          context.log.info('JWT Token verified.');
          context.log.info('decoded token:' + JSON.stringify(decoded));

          res.locals.decoded = decoded;
          next();
        }
      });
    } else {
      context.log.info('JWT Token was not found.');
      return res.json({
        success: false,
        message: 'Token not found. User is not logged in.',
      });
    }
  } catch (e) {
    context.log.error('Auth Error.', e);
    res.status(401).send({ error: 'Please Authenticate' });
  }
};

module.exports = auth;
