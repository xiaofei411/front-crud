const express = require('express');
const passportJWT = require('../auth/jwt');
const { sendEmailWithRetry } = require('../utils/email');
const { getUserBalance, addWalletToUser } = require('../models/wallet');
const { getClassAndFreeSeats } = require('../models/class');
const { createNewInvoice } = require('../models/invoice');
const knex = require('../db/connection');

const router = express.Router();

router.post('/new', passportJWT.authenticate('jwt'), (req, res, next) => {
  if (!req.body.amount) {
    return res.status(400).send('Amount is required');
  }
  if (!req.body.class_id) {
    return res.status(400).send('Class id is required');
  }
  return getClassAndFreeSeats({ id: req.body.class_id }).then(
    classData => {
      if (classData.seatsRemaining < req.body.amount) {
        return res.status(400).send('Not enough seats');
      }
      return getUserBalance(req).then(
        balance => {
          if (balance < classData.price * req.body.amount) {
            return res.status(400).send('Feil: Ikke nok smakskuponger');
          }
          return knex.transaction(trx =>
            addWalletToUser({
              type: 'debit',
              amount: req.body.amount * classData.price,
              user_id: req.user.id,
            })
              .transacting(trx)
              .then(
                walletData =>
                  createNewInvoice({
                    user: req.user,
                    class_id: req.body.class_id,
                    wallet_id: walletData[0].id,
                    amount: req.body.amount,
                  })
                    .transacting(trx)
                    .then(
                      invoiceData => {
                        if (req.user.allow_communication) {
                          sendEmailWithRetry(
                            req.user.email,
                            'Betalingen for kurs',
                            'billing',
                            {
                              header:
                                'Suksess! Betalingen er gjennomført for kurs dette er den inngangsbillett til kurset.',
                              subheader: classData.name,
                              meta: req.user.name,
                              billings: [
                                {
                                  name: classData.name,
                                  value: `${req.body.amount *
                                    classData.price} Smakskuponger`,
                                },
                              ],
                              total: `${req.body.amount *
                                classData.price} Smakskuponger`,
                            }
                          );
                        }
                        const responseBody = {
                          statusCode: 200,
                          statusMessage: 'Create invoice success',
                          data: invoiceData[0],
                        };
                        return res
                          .status(responseBody.statusCode)
                          .json(responseBody);
                      },
                      err => next(err)
                    ),
                err => next(err)
              )
          );
        },
        err => next(err)
      );
    },
    err => next(err)
  );
});

module.exports = router;
