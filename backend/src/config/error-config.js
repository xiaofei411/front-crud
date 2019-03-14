/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
(function(errorConfig) {
  // *** error handling *** //

  errorConfig.init = function(app) {
    // development error handler (will print stacktrace)
    if (app.get('env') === 'development') {
      app.use((err, _req, res) => {
        res.status(500).send({
          message: err.message,
          error: err,
        });
      });
    }

    // production error handler (no stacktraces leaked to user)
    app.use((err, req, res) => {
      // eslint-disable-next-line no-console
      console.log('request handing error', err.status);
      // eslint-disable-next-line no-console
      console.log('request handing error', err.message);
      // eslint-disable-next-line no-console
      console.log('request handing error', req.originalUrl);
      res.status(500).send({
        message: err.message,
        error: err,
        req: req.originalUrl,
      });
    });
  };
})(module.exports);
