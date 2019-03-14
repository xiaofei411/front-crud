const express = require('express');
const moment = require('moment');

const router = express.Router();

const deployedTimestamp = moment()
  .utc()
  .toISOString();

router.get('/', (req, res) => {
  const responseBody = {
    statusCode: 200,
    statusMessage: 'Get root success',
    data: { deployedTimestamp },
  };
  return res.status(responseBody.statusCode).json(responseBody);
});

module.exports = router;
