require('dotenv').config({ silent: true });

module.exports = {
  development: {
    client: 'postgresql',
    debug: process.env.DB_DEBUG || false,
    connection: {
      host : 'localhost',
      database: 'spisogdrikk_db_dev',
      user: 'postgres',
      password: 'admin'
    },
    pool: {
      afterCreate(conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', err => {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query(
              'create extension if not exists "pgcrypto";',
              noCryptoErr => {
                // if err is not falsy, connection is discarded from pool
                // if connection aquire was triggered by a query the error is passed to query promise
                done(noCryptoErr, conn);
              }
            );
          }
        });
      },
    },
    migrations: {
      directory: `${__dirname}/src/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/db/seeds`,
    },
  },
  test: {
    client: 'postgresql',
    debug: process.env.DB_DEBUG || false,
    connection: process.env.TEST_DATABASE_URL,
    pool: {
      min: 0,
      max: 1,
      afterCreate(conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', err => {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query(
              'create extension if not exists "pgcrypto";',
              cryptoError => {
                // if err is not falsy, connection is discarded from pool
                // if connection aquire was triggered by a query the error is passed to query promise
                done(cryptoError, conn);
              }
            );
          }
        });
      },
    },
    migrations: {
      directory: `${__dirname}/src/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/db/seeds`,
    },
  },
  staging: {
    client: 'postgresql',
    connection: process.env.STAGING_DATABASE_URL,
    debug: process.env.DB_DEBUG || false,
    pool: {
      min: 2,
      max: 150,
      afterCreate(conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', err => {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query(
              'create extension if not exists "pgcrypto";',
              crytoError => {
                // if err is not falsy, connection is discarded from pool
                // if connection aquire was triggered by a query the error is passed to query promise
                done(crytoError, conn);
              }
            );
          }
        });
      },
    },
    migrations: {
      directory: `${__dirname}/src/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/db/seeds`,
    },
  },
  production: {
    client: 'postgresql',
    connection: process.env.PROD_DATABASE_URL,
    debug: process.env.DB_DEBUG || false,
    pool: {
      min: 2,
      max: 150,
      afterCreate(conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', err => {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query(
              'create extension if not exists "pgcrypto";',
              crytoError => {
                // if err is not falsy, connection is discarded from pool
                // if connection aquire was triggered by a query the error is passed to query promise
                done(crytoError, conn);
              }
            );
          }
        });
      },
    },
    migrations: {
      directory: `${__dirname}/src/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/db/seeds`,
    },
  },
};
