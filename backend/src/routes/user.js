const express = require('express');

const passportJWT = require('../auth/jwt');


const { updateUser, getUserClasses } = require('../models/user.js');
const { updatePreferences } = require('../models/preferences.js');

const router = express.Router();

router.get('/', passportJWT.authenticate('jwt'), (_req, res) => {
  const responseBody = {
    statusCode: 200,
    statusMessage: 'Get user success',
    data: {},
  };
  return res.status(responseBody.statusCode).json(responseBody);
});

router.post('/', passportJWT.authenticate('jwt'), (req, res) => {
  updateUser(req)
    .then(editUserResponse => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Edit user success',
        data: editUserResponse[0],
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(editUserError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Edit user error',
        data: editUserError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.get('/classes', passportJWT.authenticate('jwt'), (req, res) => {
  getUserClasses(req)
    .then(allUserClasses => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Get user classes success',
        data: allUserClasses,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })
    .catch(getUserClassesError => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Get user classes error',
        data: getUserClassesError,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.post('/preferences', passportJWT.authenticate('jwt'), (req, res, next) =>
  updatePreferences({
    id: req.user.id,
    allow_analysis: req.body.allow_analysis,
    allow_communication: req.body.allow_communication,
  }).then(
    preferences => {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Successfully updated preferences',
        data: {
          allow_communication: preferences[0].allow_communication,
          allow_analysis: preferences[0].allow_analysis,
        },
      };
      return res.status(responseBody.statusCode).json(responseBody);
    },
    err => next(err)
  )
);

module.exports = router;
