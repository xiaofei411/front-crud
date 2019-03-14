const knex = require('../db/connection');

const createNewInvoice = req =>
  knex('invoices')
    .insert({
      user_id: req.user.id,
      class_id: req.class_id,
      wallet_id: req.wallet_id,
      amount: req.amount,
    })
    .returning('*');

module.exports = {
  createNewInvoice,
};
