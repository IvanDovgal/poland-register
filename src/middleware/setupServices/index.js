// @flow
import type { NextFunction } from 'express';
import Logger from 'bunyan';
import type { Logger as LoggerType } from 'bunyan';
import type { TrackedRequest, TrackedResponse, Services } from '../../types';

export default () => (req: TrackedRequest, res: TrackedResponse, next: NextFunction) => {
  if (req.app.locals.logger instanceof Logger) {
    const appLogger: LoggerType = req.app.locals.logger;

    const logger: LoggerType = appLogger.child({
      requestId: req.id,
    });
    const services: Services = {
      logger,
    };
    req.services = services;
    res.services = services;
    next();
  } else {
    throw new Error('Could not initialize services');
  }
};
