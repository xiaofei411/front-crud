const express = require('express');
const uuid = require('uuid/v4');
const moment = require('moment');
const md5 = require('md5');
const knex = require('../db/connection');
const { sendEmailWithRetry } = require('../utils/email');
const passportJWT = require('../auth/jwt');
const {
  createNewOrder,
  markOrderAsPaid,
  getOrderDetails,
} = require('../models/orders');
const { addWalletToUser } = require('../models/wallet');
const { getUserDetails } = require('../models/user');
const { placeOrder } = require('../utils/bambora');

const router = express.Router();

router.post('/new', passportJWT.authenticate('jwt'), (req, res, next) => {
  if (!(req.body.token_amount && req.body.token_amount > 0)) {
    const responseBody = {
      statusCode: 400,
      statusMessage: 'Invalid token amount',
      data: {},
    };
    return res.status(responseBody.statusCode).json(responseBody);
  }
  const orderSum = req.body.token_amount * process.env.TOKEN_PRICE;
  const orderId = uuid()
    .split('-')
    .join('')
    .slice(0, 20);
  return placeOrder(orderId, orderSum).then(
    response => {
      const callbackURL = Buffer.from(
        `${orderId}${req.body.token_amount}${req.user.id}`
      ).toString('base64');
      createNewOrder({
        id: orderId,
        token_amount: req.body.token_amount,
        token_price: process.env.TOKEN_PRICE,
        user: req.user,
        callback_url: callbackURL,
      }).then(
        () => {
          const responseBody = {
            statusCode: 200,
            statusMessage: 'Get payment link success',
            data: {
              url: response.data.url,
              orderId,
            },
          };
          return res.status(responseBody.statusCode).send(responseBody);
        },
        err => next(err)
      );
    },
    err => {
      console.log('Request to Bambora failed', JSON.stringify(err.data));
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Request to Bambora failed',
        data: {
          errorMessage: err.message,
          body: err.body,
          timestamp: moment()
            .utc()
            .toISOString(),
        },
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
  );
});

router.get('/token_price', (req, res) => {
  const responseBody = {
    statusCode: 200,
    statusMessage: 'Get token price success',
    data: Number(process.env.TOKEN_PRICE),
  };
  return res.status(responseBody.statusCode).json(responseBody);
});

router.post('/details', passportJWT.authenticate('jwt'), (req, res, next) => {
  if (!req.body.id) {
    return res.status(400).send('Order id is required');
  }
  return getOrderDetails({ id: req.body.id }).then(
    order => {
      if (!order[0]) {
        return res.status(400).send('Wrong order id');
      }
      if (req.user.id !== order[0].user_id) {
        return res.status(403).send('Forbidden');
      }
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get order details success',
        data: order[0],
      };
      return res.status(responseBody.statusCode).json(responseBody);
    },
    err => next(err)
  );
});

router.get('/verify', (req, res, next) => {
  if (!req.query.orderid) {
    return res.status(400).send('Order id is required');
  }
  return getOrderDetails({ id: req.query.orderid }).then(
    order => {
      if (!(order[0] && !order[0].paid)) {
        return res.status(400).send('Wrong order id');
      }
      /* we need to keep original query keys order, so use manual parsing */
      let stringToValidate = '';
      let { url } = req;
      do {
        if (url.indexOf('hash') !== url.indexOf('=') - 4) {
          stringToValidate += url.slice(
            url.indexOf('=') + 1,
            url.indexOf('&') === -1 ? undefined : url.indexOf('&')
          );
        }
        url = url.slice(url.indexOf('&') + 1);
      } while (url.indexOf('&') !== -1);
      stringToValidate += process.env.BAMBORA_MD5_KEY;
      const hash = md5(stringToValidate);
      if (hash !== req.query.hash) {
        return res.status(400).send('Validation failed');
      }
      return knex.transaction(trx =>
        markOrderAsPaid({ id: req.query.orderid })
          .transacting(trx)
          .then(
            () =>
              addWalletToUser({
                type: 'credit',
                amount: order[0].token_amount,
                user_id: order[0].user_id,
              })
                .transacting(trx)
                .then(
                  () =>
                    getUserDetails({ id: order[0].user_id })
                      .transacting(trx)
                      .then(
                        userData => {
                          if (userData[0].allow_communication) {
                            sendEmailWithRetry(
                              userData[0].email,
                              'Suksess! Betalingen er gjennomført.',
                              'billing',
                              {
                                header: 'Suksess!',
                                subheader: 'Betalingen er gjennomført.',
                                meta: userData[0].name,
                                billings: [
                                  {
                                    name: 'Spis Og Drikk smakskuponger',
                                    value: `${order[0].token_amount *
                                      process.env.TOKEN_PRICE} NOK`,
                                  },
                                ],
                                total: `${order[0].token_amount *
                                  process.env.TOKEN_PRICE} NOK`,
                              }
                            );
                          }
                          return res.status(200).send('Order processed');
                        },
                        err => next(err)
                      ),
                  err => next(err)
                ),
            err => next(err)
          )
      );
    },
    err => next(err)
  );
});

module.exports = router;
