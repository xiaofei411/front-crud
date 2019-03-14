const axios = require('axios');
const authHelpers = require('../auth/_helpers');

const placeOrder = (orderId, orderSum) => {
  const bamboraAuthHeader = authHelpers.encodeBamboraAuthHeader(
    process.env.BAMBORA_ACCESS_KEY,
    process.env.BAMBORA_MERCHANT_NUMBER,
    process.env.BAMBORA_SECRET_KEY
  );
  return axios.post(
    process.env.BAMBORA_CHECKOUT_API_URL,
    {
      order: {
        id: orderId,
        /* Bambora uses minor currency units */
        amount: orderSum * 100,
        currency: process.env.CURRENCY,
      },
      url: {
        accept: process.env.ACCEPT_URL,
        cancel: process.env.CANCEL_URL,
        callbacks: [
          {
            url: process.env.CALLBACK_URL,
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Basic ${bamboraAuthHeader}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
};

module.exports = { placeOrder };
