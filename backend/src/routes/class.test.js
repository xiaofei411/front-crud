process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');

jest.useFakeTimers();

let server;
let request;

describe('/api/v1/class/', () => {
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

  describe('GET /api/v1/class/', () => {
    test('should get all classes after log in', () => {
      expect.assertions(5);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .get('/api/v1/class')
            .set('authtoken', loginResponse.body.data.token)
            .then(allClassesResponse => {
              expect(allClassesResponse.status).toBe(200);
              expect(allClassesResponse.body.statusMessage).toBe(
                'Get all classes success'
              );
              expect(allClassesResponse.body.data[0].name).toBe(
                'Learn how to taste cheese'
              );
              expect(allClassesResponse.body.data[0].location).toBe('Sal 1');
              expect(allClassesResponse.body.data[0].seats_sold).toEqual(1);
            });
        });
    });

    test('should get all classes when logged out because they are public now', () => {
      expect.assertions(5);
      return request.get('/api/v1/class').then(allClassesResponse => {
        expect(allClassesResponse.status).toBe(200);
        expect(allClassesResponse.body.statusMessage).toBe(
          'Get all classes success'
        );
        expect(allClassesResponse.body.data[0].name).toBe(
          'Learn how to taste cheese'
        );
        expect(allClassesResponse.body.data[0].location).toBe('Sal 1');
        expect(allClassesResponse.body.data[0].seats_sold).toEqual(1);
      });
    });
  });

  describe('GET /api/v1/class/:id', () => {
    test('should get single class after log in', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .get('/api/v1/class/908d2487-25df-49e8-82a9-c9759cfe0f5f')
            .set('authtoken', loginResponse.body.data.token)
            .then(singleClassResponse => {
              expect(singleClassResponse.status).toBe(200);
              expect(singleClassResponse.body.statusMessage).toBe(
                'Get class by id success'
              );
              expect(singleClassResponse.body.data.name).toBe(
                'Learn how to taste cheese'
              );
            });
        });
    });

    test('should not get single class when logged out', () => {
      expect.assertions(1);
      return request
        .get('/api/v1/class/908d2487-25df-49e8-82a9-c9759cfe0f5f')
        .then(singleClassResponse => {
          expect(singleClassResponse.status).toBe(401);
        });
    });
  });
});
