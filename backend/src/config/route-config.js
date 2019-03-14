/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
(function(routeConfig) {
  routeConfig.init = function(app) {
    // *** routes *** //
    const rootRoutes = require('../routes/root');
    const userRoutes = require('../routes/user');
    const authRoutes = require('../routes/auth');
    const walletRoutes = require('../routes/wallet');
    const eventRoutes = require('../routes/event');
    const venueRoutes = require('../routes/venue');
    const vendorRoutes = require('../routes/vendor');
    const classRoutes = require('../routes/class');
    const orderRoutes = require('../routes/order');
    const invoiceRoutes = require('../routes/invoice');

    // *** register routes *** //
    app.use('/', rootRoutes);
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/wallet', walletRoutes);
    app.use('/api/v1/event', eventRoutes);
    app.use('/api/v1/venue', venueRoutes);
    app.use('/api/v1/vendor', vendorRoutes);
    app.use('/api/v1/class', classRoutes);
    app.use('/api/v1/order', orderRoutes);
    app.use('/api/v1/invoice', invoiceRoutes);
  };
})(module.exports);
