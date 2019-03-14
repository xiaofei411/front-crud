const bcrypt = require('bcryptjs');

exports.seed = knex =>
  knex('users')
    .del()
    .then(() =>
      knex('users').insert({
        id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d5980f',
        email: 'success@simulator.amazonses.com',
        name: 'Jeremy Johnson',
        password: bcrypt.hashSync('johnson123', bcrypt.genSaltSync()),
        birthday: '1980-01-22',
        email_verified: false,
      })
    )
    .then(() =>
      knex('users').insert({
        id: 'f3d402b1-6109-4ae5-9fc8-40c7459bb84d',
        email: 'kelly@example.com',
        name: 'Kelly Bryant',
        password: bcrypt.hashSync('bryant123', bcrypt.genSaltSync()),
        email_verified: false,
      })
    )
    .then(() =>
      knex('users').insert({
        id: 'd944da5f-36e5-4c6d-a4ed-a6e4f0d59878',
        email: 'jeremy@example.com',
        name: 'Jeremy Johnson',
        password: bcrypt.hashSync('johnson123', bcrypt.genSaltSync()),
        birthday: '1980-01-22',
        email_verified: false,
      })
    );
