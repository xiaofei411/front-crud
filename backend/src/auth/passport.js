const passport = require('passport');

const knex = require('../db/connection');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) =>
    knex('users')
      .where({
        id: userId,
      })
      .first()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  );
};
