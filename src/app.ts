require('dotenv').config();

import express, { Application, Request, Response } from 'express';
import 'reflect-metadata';
import { authentication } from './middleware/authentication/authentication';
import { authorization } from './middleware/authorization/authorization';
import passport from './middleware/passport';
import deleteRouter from './routers/haa-delete.router';
import getRouter from './routers/haa-get.router';
import patchRouter from './routers/haa-patch.router';
import postRouter from './routers/haa-post.router';
import taskPostRouter from './routers/haa-task-post.router';
import taskPatchRouter from './routers/haa-task-patch.router';
import healthCheckRouter from './routers/health-check.router';
import fileStatisticsRouter from './routers/file-statistics.router';
import metricsRouter from './routers/metrics.router';
import { AppConfig } from './utils/app-config';
import { contextMiddleware } from './utils/context';
import DataBase from './utils/database';
import log from './utils/logger';
import mapperLoader from './utils/mapperLoader';
import { userInformationMiddleware } from './middleware/userinformation/userinformation';
import { orderValidatorOpts } from './utils/validationUtils';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = <AppConfig>require('config');

DataBase.initialize()
  .then(() => {
    log.debug('Database.initialize finished . Application is starting ....');
    const app: Application = express();
    app.use('/metrics', metricsRouter);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.JWT_SESSION_SECRET,
        rolling: true,
        cookie: { maxAge: 60 * 60 * 1000, secure: true }, // set cookie to 1 hr TODO put to env
        unset: 'destroy',
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(contextMiddleware);
    app.use(`${config.server.contextPath}/health`, healthCheckRouter);
    app.use(`${config.server.contextPath}/homepage`, fileStatisticsRouter);

    app.use(authentication);
    app.use(userInformationMiddleware);
    app.use(authorization);

    //load routers
    app.use(`${config.server.contextPath}/`, getRouter);
    app.use(`${config.server.contextPath}/`, postRouter);
    app.use(`${config.server.contextPath}/`, patchRouter);
    app.use(`${config.server.contextPath}/`, deleteRouter);
    app.use(`${config.server.contextPath}/`, taskPostRouter);
    app.use(`${config.server.contextPath}/`, taskPatchRouter);

    app.use((err: any, req: Request, res: Response, next: any) => {
      let errorStatus = err.status || 500;
      if (err.status === 404) {
        errorStatus = 501;
      }
      res.status(errorStatus).json({
        message: err.message,
        errors: err.errors,
      });
    });

    mapperLoader.load();

    const port = config.server.port;
    app.listen(port, () => log.debug('server is up. with port:' + port));
  })
  .catch((error) => {
    log.error('Database.initialize failed with error: ', error);
    shutdown(error);
  });

async function shutdown(e: any) {
  log.error('Shut down started with error', e);
  let err = e;

  try {
    await DataBase.closePool();
  } catch (e) {
    log.error('Encountered error', e);
    err = err || e;
  }

  log.error('Exiting process', e);

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.once('SIGTERM', shutdown).once('SIGINT', shutdown).once('uncaughtException', shutdown);
