// @flow

import type { NextFunction } from 'express';
import type { TrackedRequest, TrackedResponse } from '../../types';

interface JsonSchemaValidation extends Error {
  validations?: mixed
}

export default () => (
  err: JsonSchemaValidation,
  req: TrackedRequest,
  res: TrackedResponse,
  next: NextFunction,
) => {
  if (err.name === 'JsonSchemaValidation') {
    res.status(400).json({
      success: false,
      data: {
        statusText: 'Bad Request',
        validations: err.validations,
      },
    });
  } else {
    next(err);
  }
};
