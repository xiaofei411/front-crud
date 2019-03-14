
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const init = require('./passport');

const { getUserDetails } = require('../models/user');

const options = {
  jwtFromRequest: ExtractJwt.fromHeader('authtoken'),
  secretOrKey: process.env.JWT_SECRET,
  session: false,
};

init();
passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    const { id } = jwtPayload;
    return getUserDetails({ id })
      .then(user => {
        if (user[0]) {
          return done(null, user[0]);
        }
        return done(null, false);
      })
      .catch(err => done(err));
  })
);

module.exports = passport;
