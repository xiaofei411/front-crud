const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const init = require('./passport');
const authHelpers = require('./_helpers');
const { getUserByEmail } = require('../models/user.js');

const options = {
  session: false,
  usernameField: 'email',
  passwordField: 'password',
};

init();

passport.use(
  new LocalStrategy(options, (email, password, done) =>
    getUserByEmail({ email })
      .first()
      .then(user => {
        if (!user) return done(null, false);
        if (!authHelpers.comparePass(password, user.password)) {
          return done(null, false);
        }
        // eslint-disable-next-line no-param-reassign
        delete user.password;
        return done(null, user);
      })
      .catch(err => done(err))
  )
);

module.exports = passport;
