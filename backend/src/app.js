// *** dependencies *** //
const express = require('express');

const appConfig = require('./config/main-config.js');
const routeConfig = require('./config/route-config.js');
const errorConfig = require('./config/error-config.js');

// *** express instance *** //
const app = express();

// *** config *** //
appConfig.init(app, express);

routeConfig.init(app);

app.use('*', (req, res) => {
  res.status(404).send('Not found');
});
errorConfig.init(app);

module.exports = app;
