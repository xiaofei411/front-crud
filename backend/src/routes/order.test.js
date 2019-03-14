process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const nock = require('nock');
const http = require('http');
const md5 = require('md5');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');
const email = require('../utils/email');

jest.useFakeTimers();
jest.mock('../utils/email.js', () => ({
  sendEmailWithRetry: jest.fn(),
}));

let server;
let request;

describe('/api/v1/order/', () => {
  beforeAll(done => {
    app.use(bodyParser.json());
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
  });

  afterAll(done => {
    server.close(done);
    knex.destroy();
  });

  beforeEach(done =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run().then(() => done()))
  );

  afterEach(done => knex.migrate.rollback().then(() => done()));

  describe('POST /api/v1/order/new', () => {
    test('should place a new order', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 20 })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.body.data.url).toMatch(
                /^https:\/\/v1.checkout.bambora.com\//
              );
              expect(res.body.statusCode).toStrictEqual(200);
              expect(res.body.statusMessage).toStrictEqual(
                'Get payment link success'
              );
            })
        );
    }, 15000);

    test('should return status 400 for zero amount', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 0 })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.status).toStrictEqual(400);
              expect(res.body.statusMessage).toStrictEqual(
                'Invalid token amount'
              );
            })
        );
    });

    test('should return 500 if Bambora fails', done => {
      nock(process.env.BAMBORA_CHECKOUT_API_URL)
        .post('/')
        .reply(500);
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 20 })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.body.statusCode).toStrictEqual(500);
              expect(res.body.statusMessage).toStrictEqual(
                'Request to Bambora failed'
              );
              nock.restore();
              done();
            })
        );
    });
  });

  describe('GET /api/v1/order/token_price', () => {
    test('Should get token price', () => {
      expect.assertions(3);
      return request.get('/api/v1/order/token_price').then(res => {
        expect(res.body.statusCode).toStrictEqual(200);
        expect(res.body.statusMessage).toStrictEqual('Get token price success');
        expect(res.body.data).toStrictEqual(Number(process.env.TOKEN_PRICE));
      });
    });
  });

  describe('POST /api/v1/order/details', () => {
    test('Should provide correct order details', () => {
      expect.assertions(6);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 20 })
            .set('authtoken', response.body.data.token)
            .then(orderRes =>
              request
                .post('/api/v1/order/details')
                .send({ id: orderRes.body.data.orderId })
                .set('authtoken', response.body.data.token)
                .then(res => {
                  expect(res.body.statusCode).toStrictEqual(200);
                  expect(res.body.statusMessage).toStrictEqual(
                    'Get order details success'
                  );
                  expect(res.body.data.id).toStrictEqual(
                    orderRes.body.data.orderId
                  );
                  expect(res.body.data.token_amount).toStrictEqual(20);
                  expect(res.body.data.paid).toStrictEqual(false);
                  expect(res.body.data.token_price).toStrictEqual(
                    Number(process.env.TOKEN_PRICE)
                  );
                })
            )
        );
    });

    test('Should return status 400 for no id', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/details')
            .send()
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.status).toStrictEqual(400);
              expect(res.text).toStrictEqual('Order id is required');
            })
        );
    });

    test('Should return status 400 for wrong id', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/details')
            .send({ id: 'some_wrong_id' })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.status).toStrictEqual(400);
              expect(res.text).toStrictEqual('Wrong order id');
            })
        );
    });

    test("Should return status 403 for other user's order", () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 20 })
            .set('authtoken', response.body.data.token)
            .then(orderRes =>
              request
                .post('/api/v1/auth/register')
                .send({
                  email: 'michael2@example.com',
                  password: 'hermanRegistered',
                })
                .then(resp =>
                  request
                    .post('/api/v1/order/details')
                    .send({ id: orderRes.body.data.orderId })
                    .set('authtoken', resp.body.data.token)
                    .then(res => {
                      expect(res.status).toStrictEqual(403);
                      expect(res.text).toStrictEqual('Forbidden');
                    })
                )
            )
        );
    });
  });

  describe('GET /api/v1/order/verify', () => {
    test('Should verify correct order and send email', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 20 })
            .set('authtoken', response.body.data.token)
            .then(orderRes => {
              let query = `?orderid=${
                orderRes.body.data.orderId
              }&foo=bar&some=any`;
              const hash = md5(
                `${orderRes.body.data.orderId}barany${
                  process.env.BAMBORA_MD5_KEY
                }`
              );
              query += `&hash=${hash}`;
              return request.get(`/api/v1/order/verify${query}`).then(res => {
                expect(email.sendEmailWithRetry).toHaveBeenCalledWith(
                  'michael@example.com',
                  'Suksess! Betalingen er gjennomført.',
                  'billing',
                  {
                    header: 'Suksess!',
                    subheader: 'Betalingen er gjennomført.',
                    meta: null,
                    billings: [
                      {
                        name: 'Spis Og Drikk smakskuponger',
                        value: `${20 * process.env.TOKEN_PRICE} NOK`,
                      },
                    ],
                    total: `${20 * process.env.TOKEN_PRICE} NOK`,
                  }
                );
                expect(res.status).toStrictEqual(200);
                expect(res.text).toStrictEqual('Order processed');
              });
            })
        );
    });

    test('Should verify correct order and not send email if turned off in user preferences', () => {
      jest.clearAllMocks();
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 20 })
            .set('authtoken', response.body.data.token)
            .then(orderRes => {
              let query = `?orderid=${
                orderRes.body.data.orderId
              }&foo=bar&some=any`;
              const hash = md5(
                `${orderRes.body.data.orderId}barany${
                  process.env.BAMBORA_MD5_KEY
                }`
              );
              query += `&hash=${hash}`;
              return request.get(`/api/v1/order/verify${query}`).then(res => {
                expect(email.sendEmailWithRetry).not.toHaveBeenCalled();
                expect(res.status).toStrictEqual(200);
                expect(res.text).toStrictEqual('Order processed');
              });
            })
        );
    });

    test('Should return status 400 for no id', () => {
      expect.assertions(2);
      return request.get(`/api/v1/order/verify`).then(res => {
        expect(res.status).toStrictEqual(400);
        expect(res.text).toStrictEqual('Order id is required');
      });
    });

    test('Should return 400 status for wrong order id', () => {
      expect.assertions(2);
      return request
        .get(`/api/v1/order/verify?orderid=wrongorderid`)
        .then(res => {
          expect(res.status).toStrictEqual(400);
          expect(res.text).toStrictEqual('Wrong order id');
        });
    });

    test('Should return 400 status on validaion fail', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response =>
          request
            .post('/api/v1/order/new')
            .send({ token_amount: 20 })
            .set('authtoken', response.body.data.token)
            .then(orderRes =>
              request
                .get(
                  `/api/v1/order/verify?orderid=${
                    orderRes.body.data.orderId
                  }&foo=bar&some=any&hash=wronghash`
                )
                .then(res => {
                  expect(res.status).toStrictEqual(400);
                  expect(res.text).toStrictEqual('Validation failed');
                })
            )
        );
    });
  });
});
