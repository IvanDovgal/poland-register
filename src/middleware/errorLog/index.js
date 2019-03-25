// @flow
import serializeError from 'serialize-error';

import type {
  NextFunction,
} from 'express';
import type { Logger } from 'bunyan';
import type { TrackedRequest, TrackedResponse } from '../../types';

export default ({ logger }: { logger: Logger }) => (
  err: Error,
  req: TrackedRequest,
  res: TrackedResponse,
  next: NextFunction,
) => {
  logger.error({
    requestId: req.id,
    ...serializeError(err),
  });
  if (process.env.NODE_ENV !== 'production') next(err);
};
