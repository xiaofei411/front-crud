const express = require('express');
const passportJWT = require('../auth/jwt');
const { getAllEvents, getEventByID } = require('../models/event.js');

const router = express.Router();

router.get('/', passportJWT.authenticate('jwt'), (req, res) => {
  getAllEvents(req)
    .then(allEvents => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get all events success',
        data: allEvents,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getAllEventsError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get all events error',
        data: getAllEventsError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.get('/:id', passportJWT.authenticate('jwt'), (req, res) => {
  getEventByID(req)
    .then(singleEvent => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get event by id success',
        data: singleEvent,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getSingleEventError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get event by id error',
        data: getSingleEventError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

module.exports = router;
