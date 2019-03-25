// @flow

import { validate } from 'express-jsonschema';
import type { TrackedRequest, TrackedResponse } from '../../types';
import querySchema from './schema/division/query';

export default [validate({ query: querySchema }), (req: TrackedRequest, res: TrackedResponse) => {
  const a = Number(Array.isArray(req.query.a) ? req.query.a[0] : req.query.a);
  const b = Number(Array.isArray(req.query.b) ? req.query.b[0] : req.query.b);
  res.status(200).json({
    success: true,
    data: {
      value: req.services.mathService.divide(a, b),
    },
  });
}];
