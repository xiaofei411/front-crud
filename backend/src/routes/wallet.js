const express = require('express');
const passportJWT = require('../auth/jwt.js');
const Wallet = require('../models/wallet.js');

const router = express.Router();

function filterDebits(item) {
  return item.type === 'debit';
}

function filterCredits(item) {
  return item.type === 'credit';
}

function getAmount(item) {
  return item.amount;
}

function sum(prev, next) {
  return prev + next;
}

function findRemainingTokens(totalCredits, totalDebits) {
  return totalCredits - totalDebits;
}

router.get('/', passportJWT.authenticate('jwt'), (req, res) => {
  Wallet.getWalletOfUser(req)
    .then(walletData => {
      const totalDebits = walletData
        .filter(filterDebits)
        .map(getAmount)
        .reduce(sum, 0);
      const totalCredits = walletData
        .filter(filterCredits)
        .map(getAmount)
        .reduce(sum, 0);
      const remainingTokens = findRemainingTokens(totalCredits, totalDebits);
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get wallet success',
        data: { remainingTokens, walletData },
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(error => {
      const responseBody = {
        statusCode: 400,
        statusMessage: 'Get wallet failure',
        data: { error },
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

module.exports = router;
