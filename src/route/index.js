// @flow
import { Router } from 'express';
import createMathRouter from './math';

export default () => {
  const router = new Router();
  router.use('/math', createMathRouter());
  return router;
};
