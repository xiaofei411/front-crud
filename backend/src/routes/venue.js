const express = require('express');
const passportJWT = require('../auth/jwt');
const { getAllVenues } = require('../models/venue.js');

const router = express.Router();

router.get('/', passportJWT.authenticate('jwt'), (req, res) => {
  getAllVenues(req)
    .then(allVenues => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get all venues success',
        data: allVenues,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getAllVenuesError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get all venues error',
        data: getAllVenuesError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

module.exports = router;
