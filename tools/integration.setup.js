// @flow
import { createLogger } from 'bunyan';
import { Validator } from 'jsonschema';
import createApp from '../src/app';

const app = process.env.API_URL || createApp({
  logger: createLogger({
    name: 'test',
    streams: [],
  }),
});
global.APP = app;

const v = new Validator();

interface ValidationError extends Error {
  validations?: any[]
}

global.validateSchema = schema => (res) => {
  const result = v.validate(res.body, schema, { throwError: false });
  if (!result.valid) {
    const error: ValidationError = new Error(`Validation JsonSchema fail:\n${result.toString()}`);
    error.validations = result.validations;
    throw error;
  }
};
