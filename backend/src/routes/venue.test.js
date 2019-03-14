process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');

jest.useFakeTimers();

let server;
let request;

describe('/api/v1/venue/', () => {
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

  describe('GET /api/v1/venue/', () => {
    test('should get all venues after log in', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .get('/api/v1/venue')
            .set('authtoken', loginResponse.body.data.token)
            .then(allVenuesResponse => {
              expect(allVenuesResponse.status).toBe(200);
              expect(allVenuesResponse.body.statusMessage).toBe(
                'Get all venues success'
              );
              expect(allVenuesResponse.body.data[0].name).toBe(
                'Oslo Spektrum Arena'
              );
            });
        });
    });

    test('should not get all venues when logged out', () => {
      expect.assertions(1);
      return request.get('/api/v1/venue').then(allEventsResponse => {
        expect(allEventsResponse.status).toBe(401);
      });
    });
  });
});
