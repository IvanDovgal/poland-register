// @flow
import { Router } from 'express';
import divideController from './divideController';
import squareRootController from './squareRootController';

export default () => {
  const router = new Router();
  router.get('/', ...divideController);
  router.post('/', ...squareRootController);
  return router;
};
