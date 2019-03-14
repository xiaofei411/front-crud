process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
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

describe('/api/v1/invoice/', () => {
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

  describe('POST /api/v1/invoice/new', () => {
    test('should create an invoice and send email', () => {
      expect.assertions(6);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(response =>
          request
            .post('/api/v1/invoice/new')
            .send({
              class_id: '908d2487-25df-49e8-82a9-c9759cfe0f5f',
              amount: 2,
            })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(email.sendEmailWithRetry).toHaveBeenCalledWith(
                'success@simulator.amazonses.com',
                'Betalingen for kurs',
                'billing',
                {
                  header:
                    'Suksess! Betalingen er gjennomført for kurs dette er den inngangsbillett til kurset.',
                  subheader: 'Learn how to taste cheese',
                  meta: `Jeremy Johnson`,
                  billings: [
                    {
                      name: 'Learn how to taste cheese',
                      value: `30 Smakskuponger`,
                    },
                  ],
                  total: `30 Smakskuponger`,
                }
              );
              expect(res.body.data.class_id).toStrictEqual(
                '908d2487-25df-49e8-82a9-c9759cfe0f5f'
              );
              expect(res.body.data.user_id).toStrictEqual(
                'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f'
              );
              expect(res.body.data.amount).toStrictEqual(2);
              expect(res.body.statusCode).toStrictEqual(200);
              expect(res.body.statusMessage).toStrictEqual(
                'Create invoice success'
              );
            })
        );
    });

    test('should create an invoice and not send email if turned off in user preferences', () => {
      jest.clearAllMocks();
      expect.assertions(6);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'jeremy@example.com',
          password: 'johnson123',
        })
        .then(response =>
          request
            .post('/api/v1/invoice/new')
            .send({
              class_id: '908d2487-25df-49e8-82a9-c9759cfe0f5f',
              amount: 1,
            })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(email.sendEmailWithRetry).not.toHaveBeenCalled();
              expect(res.body.data.class_id).toStrictEqual(
                '908d2487-25df-49e8-82a9-c9759cfe0f5f'
              );
              expect(res.body.data.user_id).toStrictEqual(
                'd944da5f-36e5-4c6d-a4ed-a6e4f0d59878'
              );
              expect(res.body.data.amount).toStrictEqual(1);
              expect(res.body.statusCode).toStrictEqual(200);
              expect(res.body.statusMessage).toStrictEqual(
                'Create invoice success'
              );
            })
        );
    });

    test('should return 400 for no class id', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'kelly@example.com',
          password: 'bryant123',
        })
        .then(response =>
          request
            .post('/api/v1/invoice/new')
            .send({ amount: 5 })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.status).toStrictEqual(400);
              expect(res.text).toStrictEqual('Class id is required');
            })
        );
    });

    test('should return 400 for no amount', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'kelly@example.com',
          password: 'bryant123',
        })
        .then(response =>
          request
            .post('/api/v1/invoice/new')
            .send({ class_id: '908d2487-25df-49e8-82a9-c9759cfe0f5f' })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.status).toStrictEqual(400);
              expect(res.text).toStrictEqual('Amount is required');
            })
        );
    });

    test('should return 400 for insufficient tokens', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'kelly@example.com',
          password: 'bryant123',
        })
        .then(response =>
          request
            .post('/api/v1/invoice/new')
            .send({
              class_id: '908d2487-25df-49e8-82a9-c9759cfe0f5f',
              amount: 2,
            })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.status).toStrictEqual(400);
              expect(res.text).toStrictEqual('Feil: Ikke nok smakskuponger');
            })
        );
    });

    test('should return 400 for lack of seats', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'kelly@example.com',
          password: 'bryant123',
        })
        .then(response =>
          request
            .post('/api/v1/invoice/new')
            .send({
              class_id: '54266d87-51e6-4533-969b-803f22e65912',
              amount: 7,
            })
            .set('authtoken', response.body.data.token)
            .then(res => {
              expect(res.status).toStrictEqual(400);
              expect(res.text).toStrictEqual('Not enough seats');
            })
        );
    });
  });
});
