// @flow

import type {
  NextFunction,
} from 'express';
import type { Logger } from 'bunyan';
import type { TrackedRequest, TrackedResponse } from '../../types';


const httpTransactionMapper = (req: TrackedRequest, res: TrackedResponse): any => ({
  requestId: req.id,
  method: req.method,
  userAgent: req.headers['user-agent'],
  host: req.headers.host,
  url: req.url,
  status: res.statusCode,
  clientIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
});


export default ({ logger }: { logger: Logger }) => (
  req: TrackedRequest,
  res: TrackedResponse,
  next: NextFunction,
) => {
  res.on('finish', () => {
    logger.info(httpTransactionMapper(req, res));
  });
  next();
};
