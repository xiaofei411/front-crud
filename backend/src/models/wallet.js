const knex = require('../db/connection');

function getWalletOfUser(req) {
  return knex('wallets').where({
    'wallets.user_id': req.user.id,
  });
}

function getUserBalance(req) {
  return knex('wallets')
    .where({ 'wallets.user_id': req.user.id })
    .then(wallets => {
      let userBalance = 0;
      wallets.forEach(wallet => {
        userBalance +=
          wallet.type === 'credit' ? wallet.amount : wallet.amount * -1;
      });
      return userBalance;
    });
}

function addWalletToUser(req) {
  return knex('wallets')
    .insert({
      type: req.type,
      amount: req.amount,
      user_id: req.user_id,
    })
    .returning('*');
}

module.exports = {
  getWalletOfUser,
  addWalletToUser,
  getUserBalance,
};
