// @flow

import request from 'supertest';
import responseSchema from '../schema/division/response';

describe('GET /match', () => {
  it('response should valid schema', (done) => {
    request(APP)
      .get('/math')
      .query({ a: 100, b: 5 })
      .set('Accept', 'application/json')
      .expect(validateSchema(responseSchema))
      .end(done);
  });
  it('response should true calc', (done) => {
    request(APP)
      .get('/math')
      .query({ a: 100, b: 5 })
      .set('Accept', 'application/json')
      .expect({
        success: true,
        data: {
          value: 20,
        },
      })
      .end(done);
  });
  it('response should be bad request if query not valid', (done) => {
    request(APP)
      .get('/math')
      .query({ a: 100 })
      .set('Accept', 'application/json')
      .expect(400)
      .end(done);
  });
});
