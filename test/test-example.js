/**
 * Created by tigaly on 2017/4/6.
 */

const test = require('tape');
const request = require('supertest');
const app = require('../app/app');
const agent = request.agent(app);

test('GET /unprotected - Un protected', t => {
    agent
    .get('/unprotected')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end(err => {
      t.ifError(err);
      t.same(0, 0, 'Count should be 0');
      t.end();
    })
})

test.onFinish(() => process.exit(0));
