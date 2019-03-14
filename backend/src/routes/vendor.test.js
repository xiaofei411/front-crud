process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const http = require('http');
const bodyParser = require('body-parser');
const app = require('../app.js');
const knex = require('../db/connection');

jest.useFakeTimers();

let server;
let request;

describe('/api/v1/vendor/', () => {
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

  describe('GET /api/v1/vendor/', () => {
    test('should get all vendors after log in', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .get('/api/v1/vendor')
            .set('authtoken', loginResponse.body.data.token)
            .then(allVendorsResponse => {
              expect(allVendorsResponse.status).toBe(200);
              expect(allVendorsResponse.body.statusMessage).toBe(
                'Get all vendors success'
              );
              expect(allVendorsResponse.body.data[0].name).toBe('Tasty Wines');
            });
        });
    });

    test('should not get all vendors when logged out', () => {
      expect.assertions(1);
      return request.get('/api/v1/vendor').then(allVendorsResponse => {
        expect(allVendorsResponse.status).toBe(401);
      });
    });
  });

  describe('GET /api/v1/vendor/:vendor_id', () => {
    test('should get single vendor after log in', () => {
      expect.assertions(3);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .get('/api/v1/vendor/5be32eed-06fa-481e-bccb-250956a92b1b')
            .set('authtoken', loginResponse.body.data.token)
            .then(singleVendorResponse => {
              expect(singleVendorResponse.status).toBe(200);
              expect(singleVendorResponse.body.statusMessage).toBe(
                'Get vendor by id success'
              );
              expect(singleVendorResponse.body.data.name).toBe('Tasty Wines');
            });
        });
    });

    test('should not get all vendors when logged out', () => {
      expect.assertions(1);
      return request
        .get('/api/v1/vendor/5be32eed-06fa-481e-bccb-250956a92b1b')
        .then(singleVendorResponse => {
          expect(singleVendorResponse.status).toBe(401);
        });
    });
  });

  describe('GET /api/v1/vendor/:vendor_id/classes', () => {
    test('should get single vendor with classes after log in', () => {
      expect.assertions(5);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .get('/api/v1/vendor/5be32eed-06fa-481e-bccb-250956a92b1b/classes')
            .set('authtoken', loginResponse.body.data.token)
            .then(singleVendorWithClassesResponse => {
              expect(singleVendorWithClassesResponse.status).toBe(200);
              expect(singleVendorWithClassesResponse.body.statusMessage).toBe(
                'Get vendor by id with classes success'
              );
              expect(
                singleVendorWithClassesResponse.body.data[0].vendor_id
              ).toBe('5be32eed-06fa-481e-bccb-250956a92b1b');
              expect(singleVendorWithClassesResponse.body.data[0].name).toBe(
                'Learn how to taste cheese'
              );
              expect(singleVendorWithClassesResponse.body.data.length).toBe(1);
            });
        });
    });

    test('should not get all vendors with classes when logged out', () => {
      expect.assertions(1);
      return request
        .get('/api/v1/vendor/5be32eed-06fa-481e-bccb-250956a92b1b/classes')
        .then(singleVendorWithClassesResponse => {
          expect(singleVendorWithClassesResponse.status).toBe(401);
        });
    });
  });

  describe('POST /api/v1/vendor/:vendor_id/classes/:class_id', () => {
    test('should edit class of user owned vendor', () => {
      expect.assertions(4);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'kelly@example.com',
          password: 'bryant123',
        })
        .then(loginResponse => {
          request
            .post(
              '/api/v1/vendor/d15cc98d-1ad4-4436-ab7b-b711ab797cde/classes/54266d87-51e6-4533-969b-803f22e65912'
            )
            .set('authtoken', loginResponse.body.data.token)
            .send({
              name: 'new class name. much better than before',
              end_timestamp: '2019-03-09T16:00:00.000Z',
            })
            .then(updateVendorOwnedClassResponse => {
              expect(updateVendorOwnedClassResponse.status).toBe(200);
              expect(updateVendorOwnedClassResponse.body.statusMessage).toBe(
                'Edit vendor owned class success'
              );
              expect(updateVendorOwnedClassResponse.body.data.name).toBe(
                'new class name. much better than before'
              );
              expect(
                updateVendorOwnedClassResponse.body.data.end_timestamp
              ).toBe('2019-03-09T16:00:00.000Z');
            });
        });
    });

    test('should error for trying to edit class of vendor user does not own', () => {
      expect.assertions(2);
      return request
        .post('/api/v1/auth/login')
        .send({
          email: 'success@simulator.amazonses.com',
          password: 'johnson123',
        })
        .then(loginResponse => {
          request
            .post(
              '/api/v1/vendor/d15cc98d-1ad4-4436-ab7b-b711ab797cde/classes/54266d87-51e6-4533-969b-803f22e65912'
            )
            .set('authtoken', loginResponse.body.data.token)
            .send({ name: 'new class name. much better than before' })
            .then(updateVendorOwnedClassResponse => {
              expect(updateVendorOwnedClassResponse.status).toBe(500);
              expect(updateVendorOwnedClassResponse.body.statusMessage).toBe(
                'Edit vendor owned class error'
              );
            });
        });
    });
  });
});
