process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');

jest.useFakeTimers();

let server;
let request;

describe('/api/v1/wallet/', () => {
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

  describe('GET /api/v1/wallet/', () => {
    test('should get user wallet', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .get('/api/v1/wallet')
            .set('authtoken', loginResponse.body.data.token)
            .then(walletResponse => {
              expect(walletResponse.status).toBe(200);
              expect(walletResponse.body.statusMessage).toBe(
                'Get wallet success'
              );
              expect(walletResponse.body.data.remainingTokens).toBe(1188.5);
            });
        });
    });

    test('should not get user wallet when logged out', () => {
      expect.assertions(1);
      return request.get('/api/v1/wallet').then(walletResponse => {
        expect(walletResponse.status).toBe(401);
      });
    });
  });
});
