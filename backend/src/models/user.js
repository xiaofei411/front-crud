const moment = require('moment');
const bcrypt = require('bcryptjs');

const knex = require('../db/connection');

const getUserDetails = req =>
  knex('users')
    .where({ 'users.id': req.id })
    .leftOuterJoin('preferences', 'users.id', '=', 'preferences.user_id')
    .select(
      'users.*',
      'preferences.allow_communication',
      'preferences.allow_analysis'
    );

const createUser = req => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.password, salt);
  let userId;
  return knex
    .transaction(trx =>
      knex('users')
        .insert({
          email: req.email,
          name: req.name,
          birthday: req.birthday,
          password: hash,
          phone: req.phone,
          role: req.role,
        })
        .transacting(trx)
        .returning('*')
        .then(userData => {
          userId = userData[0].id;
          return knex('preferences')
            .insert({
              user_id: userData[0].id,
              allow_analysis: true,
              allow_communication: true,
            })
            .transacting(trx);
        })
    )
    .then(() => getUserDetails({ id: userId }));
};

const updateUser = req => {
  const updateBody = {
    name: req.body.name,
    birthday: req.body.birthday,
    updated_at: moment()
      .utc()
      .toISOString(),
  };
  return knex
    .select('*')
    .from('users')
    .where({
      'users.id': req.user.id,
    })
    .update(updateBody)
    .returning('*');
};

const getUserClasses = req =>
  knex
    .select('classes.*', 'users.name as user_name', 'invoices.id as invoice_id')
    .from('classes')
    .leftJoin('invoices', 'invoices.class_id', 'classes.id')
    .leftJoin('users', 'invoices.user_id', 'users.id')
    .where({
      'users.id': req.user.id,
    });

const getUserByEmail = req =>
  knex('users')
    .where({ 'users.email': req.email })
    .leftOuterJoin('preferences', 'users.id', '=', 'preferences.user_id')
    .select(
      'users.*',
      'preferences.allow_communication',
      'preferences.allow_analysis'
    );

module.exports = {
  createUser,
  updateUser,
  getUserDetails,
  getUserClasses,
  getUserByEmail,
};
