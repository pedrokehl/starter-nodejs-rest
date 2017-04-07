/**
 * Created by tigaly on 2017/4/6.
 */

const test = require('tape')
const request = require('supertest')
const app = require('../app/app')
const agent = request.agent(app)

test('GET /protected -  protected', t => {
  agent
    .get('/protected')
    .expect(403)
    .end(err => {
      t.ifError(err)
      t.end()
    })
})

test('POST /register - add new user', t => {
  agent
    .post('/register')
    .send({username: "test", password: "test", email: "tigaly@qq.com"})
    .expect(200)
    .end(err => {
      t.ifError(err)
      t.end()
    })
})

test('POST /login - login with test', t => {
  agent
    .post('/login')
    .send({username: "test", password: "test"})
    .expect(200)
    .end(err => {
      t.ifError(err)
      t.end()
    })
})

test.onFinish(() => process.exit(0))
