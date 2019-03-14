/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable func-names */
(function(appConfig) {
  require('dotenv').config({ silent: true });

  // *** main dependencies *** //
  const bodyParser = require('body-parser');
  const flash = require('connect-flash');
  const passport = require('passport');
  const helmet = require('helmet');
  const cors = require('cors');

  appConfig.init = function(app) {
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    app.use(passport.initialize());
    app.use(flash());
  };
})(module.exports);
