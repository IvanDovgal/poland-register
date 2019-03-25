// @flow

import request from 'supertest';
import responseSchema from '../schema/squareRoot/response';

describe('POST /match', () => {
  it('response should valid schema', (done) => {
    request(APP)
      .post('/math')
      .send({
        values: [100, 25, 49],
      })
      .set('Accept', 'application/json')
      .expect(validateSchema(responseSchema))
      .end(done);
  });
  it('response should true calc', (done) => {
    request(APP)
      .post('/math')
      .send({
        values: [100, 25, 49],
      })
      .set('Accept', 'application/json')
      .expect({
        success: true,
        data: {
          values: [10, 5, 7],
        },
      })
      .end(done);
  });
  it('response should be bad request if query not valid', (done) => {
    request(APP)
      .post('/math')
      .send({
        values: [100, 25, ''],
      })
      .set('Accept', 'application/json')
      .expect(400)
      .end(done);
  });
});
