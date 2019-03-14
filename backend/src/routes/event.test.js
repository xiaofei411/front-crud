process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');

jest.useFakeTimers();

let server;
let request;

describe('/api/v1/event/', () => {
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

  describe('GET /api/v1/event/', () => {
    test('should get all events after log in', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse =>
          request
            .get('/api/v1/event')
            .set('authtoken', loginResponse.body.data.token)
            .then(allEventsResponse => {
              expect(allEventsResponse.status).toBe(200);
              expect(allEventsResponse.body.statusMessage).toBe(
                'Get all events success'
              );
              expect(allEventsResponse.body.data[0].name).toBe('Spis Og Drikk');
            })
        );
    });

    test('should not get all events when logged out', () => {
      expect.assertions(1);
      return request.get('/api/v1/event').then(allEventsResponse => {
        expect(allEventsResponse.status).toBe(401);
      });
    });
  });

  describe('GET /api/v1/event/:id', () => {
    test('should get all events after log in', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse =>
          request
            .get('/api/v1/event/216294c1-c3a8-42a4-83f1-3ad90cd3c23e')
            .set('authtoken', loginResponse.body.data.token)
            .then(singleEventResponse => {
              expect(singleEventResponse.status).toBe(200);
              expect(singleEventResponse.body.statusMessage).toBe(
                'Get event by id success'
              );
              expect(singleEventResponse.body.data.name).toBe('Spis Og Drikk');
            })
        );
    });

    test('should not get all events when logged out', () => {
      expect.assertions(1);
      return request
        .get('/api/v1/event/216294c1-c3a8-42a4-83f1-3ad90cd3c23e')
        .then(singleEventResponse => {
          expect(singleEventResponse.status).toBe(401);
        });
    });
  });
});
