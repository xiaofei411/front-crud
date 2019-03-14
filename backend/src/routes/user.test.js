process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');

jest.useFakeTimers();

let server;
let request;

describe('/api/v1/user', () => {
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

  describe('GET /api/v1/user', () => {
    test('should get user', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(() => {
          request
            .post('/api/v1/auth/login')
            .send({
              email: 'michael@example.com',
              password: 'hermanRegistered',
            })
            .then(loginResponse => {
              request
                .get('/api/v1/user')
                .set('authtoken', loginResponse.body.data.token)
                .then(userResponse => {
                  expect(userResponse.status).toBe(200);
                  expect(userResponse.body.statusMessage).toBe(
                    'Get user success'
                  );
                });
            });
        });
    });
  });

  describe('POST /api/v1/user', () => {
    test('should edit user', () => {
      expect.assertions(4);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .post('/api/v1/user')
            .set('authtoken', loginResponse.body.data.token)
            .send({
              name: 'Jeremy Smith Johnson III',
              birthday: '1980-01-26T00:00:00.000Z',
            })
            .then(editUserResponse => {
              expect(editUserResponse.status).toBe(200);
              expect(editUserResponse.body.statusMessage).toBe(
                'Edit user success'
              );
              expect(editUserResponse.body.data.name).toBe(
                'Jeremy Smith Johnson III'
              );
              expect(editUserResponse.body.data.birthday).toBe(
                '1980-01-26T00:00:00.000Z'
              );
            });
        });
    });
  });

  describe('POST /api/v1/user/preferences', () => {
    test('should edit user preferences', () => {
      expect.assertions(4);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .post('/api/v1/user/preferences')
            .set('authtoken', loginResponse.body.data.token)
            .send({
              allow_analysis: false,
              allow_communication: false,
            })
            .then(editPreferencesResponse => {
              expect(editPreferencesResponse.status).toBe(200);
              expect(editPreferencesResponse.body.statusMessage).toBe(
                'Successfully updated preferences'
              );
              expect(
                editPreferencesResponse.body.data.allow_analysis
              ).toStrictEqual(false);
              expect(
                editPreferencesResponse.body.data.allow_communication
              ).toStrictEqual(false);
            });
        });
    });
  });
});
