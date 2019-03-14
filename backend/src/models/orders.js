const knex = require('../db/connection');

const createNewOrder = req =>
  knex('orders')
    .insert({
      id: req.id,
      user_id: req.user.id,
      token_amount: req.token_amount,
      token_price: req.token_price,
      callback_url: req.callback_url,
    })
    .returning('*');

const markOrderAsPaid = req =>
  knex('orders')
    .where({ id: req.id })
    .update({ paid: true });

const getOrderDetails = req =>
  knex('orders')
    .where({ id: req.id })
    .select('*');

module.exports = {
  createNewOrder,
  markOrderAsPaid,
  getOrderDetails,
};
