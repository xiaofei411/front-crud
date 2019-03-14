const express = require('express');
const jwt = require('jsonwebtoken');
const authHelpers = require('../auth/_helpers');
const passportLocal = require('../auth/local');
const passportJWT = require('../auth/jwt');

const router = express.Router();

router.post(
  '/register',
  authHelpers.loginRedirect,
  authHelpers.createUser,
  (req, res, next) => {
    passportLocal.authenticate('local', (_error, user) => {
      if (user) {
        const payload = {
          id: user.id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '30d',
        });
        const responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully registered user',
          data: {
            token,
            user,
          },
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Error while registering user',
      };
      return res.status(responseBody.statusCode).json(responseBody);
    })(req, res, next);
  }
);

router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passportLocal.authenticate('local', (err, user) => {
    if (err) {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Error logging in user',
        data: err,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
    if (!user) {
      const responseBody = {
        statusCode: 403,
        statusMessage: 'User not found',
        data: {},
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
    if (user) {
      req.logIn(user, error => {
        if (error) {
          const responseBody = {
            statusCode: 500,
            statusMessage: 'Error logging in user at request',
            data: {},
          };
          return res.status(responseBody.statusCode).json(responseBody);
        }
        const payload = {
          id: user.id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '24h',
        });
        const responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully logged in user',
          data: {
            token,
            user,
          },
        };
        return res.status(responseBody.statusCode).json(responseBody);
      });
    }
  })(req, res, next);
});

router.post('/adminlogin', authHelpers.loginRedirect, (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passportLocal.authenticate('local', (err, user) => {
    if (err) {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Error logging in user',
        data: err,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
    if (!user) {
      const responseBody = {
        statusCode: 403,
        statusMessage: 'User not found',
        data: {},
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
    if (user) {
      req.logIn(user, error => {
        if (error) {
          const responseBody = {
            statusCode: 500,
            statusMessage: 'Error logging in user at request',
            data: {},
          };
          return res.status(responseBody.statusCode).json(responseBody);
        }
        if(user.role != 1)
        {
          const responseBody = {
            statusCode: 500,
            statusMessage: 'Not Admin User Error',
            data: {},
          };
          return res.status(responseBody.statusCode).json(responseBody);
        }
        const payload = {
          id: user.id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '24h',
        });
        const responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully logged in user',
          data: {
            token,
            user,
          },
        };
        return res.status(responseBody.statusCode).json(responseBody);
      });
    }
  })(req, res, next);
});

router.get('/logout', passportJWT.authenticate('jwt'), (req, res) => {
  req.logout();
  const responseBody = {
    statusCode: 200,
    statusMessage: 'Logout success',
    data: {},
  };
  return res.status(responseBody.statusCode).json(responseBody);
});

router.post('/forgot', (req, res) => {
  authHelpers
    .forgotPassword(req, res)
    // eslint-disable-next-line consistent-return
    .then(response => {
      if (response) {
        const responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully sent password reset for user',
          data: response,
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch(error => {
      const responseBody = {
        statusCode: 500,
        statusMessage: error.message,
        data: error,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.post('/reset', (req, res) => {
  authHelpers
    .resetPassword(req, res)
    // eslint-disable-next-line consistent-return
    .then(response => {
      if (response) {
        const responseBody = {
          statusCode: 200,
          statusMessage: 'Successfully changed password for user',
          data: response,
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    })
    .catch(error => {
      const responseBody = {
        statusCode: 500,
        statusMessage: error.message,
        data: error,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    });
});

router.post('/verify', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
    if (decoded) {
      const responseBody = {
        statusCode: 200,
        statusMessage: 'Successfully verified jwt',
        data: decoded,
      };
      return res.status(responseBody.statusCode).json(responseBody);
    }
    const responseBody = {
      statusCode: 500,
      statusMessage: 'Error verifing jwt',
      data: err,
    };
    return res.status(responseBody.statusCode).json(responseBody);
  });
});

module.exports = router;
