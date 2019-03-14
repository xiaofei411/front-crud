const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const knex = require('../db/connection');
const { sendEmail } = require('../utils/email');
const userModel = require('../models/user');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createToken() {
  return uuidv4();
}

function validateEmail(emailToTest) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailToTest);
}

function handleErrors(req) {
  return new Promise((resolve, reject) => {
    if (req.body.password.length < 8) {
      reject({ message: 'Password must be longer than 8 characters' });
    } else if (!validateEmail(req.body.email)) {
      reject({ message: 'Email is not valid' });
    } else {
      resolve();
    }
  });
}

function isValidUUID(token) {
  const uuid = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
  return uuid.test(token);
}

function createExpiration() {
  return moment()
    .add(24, 'hours')
    .toISOString();
}

function createUser(req, res, next) {
  return handleErrors(req)
    .then(() =>
      userModel.createUser({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        phone: req.body.phone,
        role: 1,
      })
    )
    .then(
      () => next(),
      error => {
        let errorMessage = error.message;
        if (error.code && error.code === '23505') {
          errorMessage = 'User already exists';
        }
        const responseBody = {
          statusCode: 400,
          statusMessage: errorMessage,
          data: {},
        };
        return res.status(responseBody.statusCode).json(responseBody);
      }
    );
}

function loginRequired(req, res, next) {
  if (!req.user) {
    const responseBody = {
      statusCode: 401,
      statusMessage: 'Please log in',
      data: {},
    };
    return res.status(responseBody.statusCode).json(responseBody);
  }
  return next();
}

function adminRequired(req, res, next) {
  if (!req.user) {
    const responseBody = {
      statusCode: 401,
      statusMessage: 'Please log in',
      data: {},
    };
    res.status(responseBody.statusCode).json(responseBody);
  }
  return knex('users')
    .where({
      email: req.user.email,
    })
    .first()
    .then(user => {
      if (!user.admin) {
        const responseBody = {
          statusCode: 401,
          statusMessage: 'You are not authorized',
          data: {},
        };
        res.status(responseBody.statusCode).json(responseBody);
      }
      return next();
    })
    .catch(err => {
      const responseBody = {
        statusCode: 500,
        statusMessage: 'Something bad happened',
        data: err,
      };
      res.status(responseBody.statusCode).json(responseBody);
    });
}

function forgotPassword(req) {
  return new Promise((resolve, reject) => {
    if (!req.body.email) {
      reject(new Error({ message: 'please provide email' }));
    } else if (req.body.email) {
      const userPasswordResetUpdate = {
        password_reset_token: createToken(),
        password_reset_expiration: createExpiration(),
        updated_at: moment()
          .utc()
          .toISOString(),
      };
      knex('users')
        .where({ email: req.body.email })
        .first()
        .then(foundUser => {
          if (!foundUser || !foundUser.id) {
            reject({ message: 'Could not find user with this email' });
            return;
          }
          knex('users')
            .where({ id: foundUser.id })
            .update(userPasswordResetUpdate)
            .returning('*')
            .then(updatedUser => {
              if (updatedUser[0]) {
                sendEmail(
                  updatedUser[0].email,
                  'Password reset',
                  'actionable',
                  {
                    text: 'This is your password reset link',
                    buttonText: 'Reset password',
                    buttonLink: `${process.env.PASSWORD_RESET_URL}${
                      updatedUser[0].password_reset_token
                    }`,
                  }
                )
                  // eslint-disable-next-line no-unused-vars
                  .then(_message => {
                    resolve({ message: `Emailed user at ${req.body.email}` });
                  })
                  .catch(error => {
                    reject({ message: error });
                  });
              }
            });
        });
    } else {
      reject(
        new Error({
          message: 'Something went wrong when sending reset password email',
        })
      );
    }
  });
}

// eslint-disable-next-line no-unused-vars
function resetPassword(req, _res) {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    if (!req.body.token || isValidUUID(req.body.token) === false) {
      reject({
        message: 'Please provide valid token',
      });
    } else if (req.body.password.length < 8) {
      reject({
        message: 'Password must be longer than 8 characters for security',
      });
    } else if (req.body.password.length > 8 && req.body.token) {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.password, salt);
      const now = moment()
        .utc()
        .toISOString();
      const userPasswordChangeUpdate = {
        password: hash,
        updated_at: now,
        password_reset_expiration: now,
      };
      return knex('users')
        .where({ password_reset_token: req.body.token })
        .first()
        .then(foundUser => {
          if (
            foundUser &&
            moment(foundUser.password_reset_expiration).isAfter()
          ) {
            knex('users')
              .where({ id: foundUser.id })
              .update(userPasswordChangeUpdate)
              .returning('*')
              .then(updatedUser => {
                if (updatedUser) {
                  resolve({
                    message:
                      'Updated password for user. Log in with new password now.',
                  });
                }
              });
          } else {
            reject({ message: 'User not found or token has expired' });
          }
        });
    } else {
      reject({ message: 'Something went wrong when reseting password' });
    }
  });
}

function loginRedirect(req, res, next) {
  if (req.user) {
    const responseBody = {
      statusCode: 401,
      statusMessage: 'You are already logged in',
      data: {},
    };
    return res.status(responseBody.statusCode).json(responseBody);
  }
  return next();
}

const encodeBamboraAuthHeader = (accessKey, merchantNumber, secretKey) =>
  Buffer.from(`${accessKey}@${merchantNumber}:${secretKey}`).toString('base64');

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  adminRequired,
  loginRedirect,
  forgotPassword,
  resetPassword,
  encodeBamboraAuthHeader,
};
