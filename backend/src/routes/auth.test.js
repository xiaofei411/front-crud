process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');

jest.useFakeTimers();

let server;
let request;

describe('/api/v1/auth/', () => {
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

  describe('POST /api/v1/auth/register', () => {
    test('should register a new user', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.statusMessage).toBe(
            'Successfully registered user'
          );
        });
    });

    test('should register a new user with birthday', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.statusMessage).toBe(
            'Successfully registered user'
          );
        });
    });

    test('should throw an error if the password is < 8 characters', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example.com',
          password: 'six',
        })
        .then(error => {
          expect(error.status).toBe(400);
          expect(error.body.statusMessage).toBe(
            'Password must be longer than 8 characters'
          );
        });
    });

    test('should throw an error if the email is not valid', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/register')
        .send({
          email: 'michael@example',
          password: 'hermanRegistered',
        })
        .then(error => {
          expect(error.status).toBe(400);
          expect(error.body.statusMessage).toBe('Email is not valid');
        });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('should register a new user and then login the same user and test account id and ownership role is correct', () => {
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
            .then(response => {
              expect(response.status).toBe(200);
              expect(response.body.statusMessage).toBe(
                'Successfully logged in user'
              );
            });
        });
    });

    test('should not login an unregistered user', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'michael@example.com',
          password: 'hermanRegistered',
        })
        .then(response => {
          expect(response.status).toBe(403);
          expect(response.body.statusMessage).toBe('User not found');
        });
    });
  });

  describe('POST /api/v1/auth/forgot', () => {
    test('should send an email to user with reset token', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/forgot')
        .send({
          email: 'success@simulator.amazonses.com',
        })
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.statusMessage).toBe(
            'Successfully sent password reset for user'
          );
        });
    }, 30000);

    test('should throw an error if email does not exist', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/forgot')
        .send({
          email: 'jeremy@example.org',
        })
        .then(response => {
          expect(response.status).toBe(500);
          expect(response.body.statusMessage).toBe(
            'Could not find user with this email'
          );
        });
    });
  });

  describe('POST /api/v1/auth/reset', () => {
    test('should throw an error if the token is bad', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/reset')
        .send({
          token: 'a bad token',
          password: 'new password',
        })
        .then(response => {
          expect(response.status).toBe(500);
          expect(response.body.statusMessage).toBe(
            'Please provide valid token'
          );
        });
    });
  });
});
