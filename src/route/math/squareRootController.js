// @flow

import express from 'express';
import { validate } from 'express-jsonschema';
import type { TrackedRequest, TrackedResponse } from '../../types';
import requestSchema from './schema/squareRoot/request';

export default [express.json(), validate({ body: requestSchema }), (
  { body, services }: TrackedRequest,
  res: TrackedResponse,
) => {
  if (body != null && typeof body === 'object') {
    const { values } = body;
    if (values != null && typeof values === 'object' && Array.isArray(values)) {
      res.status(200).json({
        success: true,
        data: {
          values: services.mathService.squareRoot(values),
        },
      });
    }
  }
}];
