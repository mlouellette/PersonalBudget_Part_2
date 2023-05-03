const apiRouter = require('express').Router();

const envelopesRouter = require('./envelope');
apiRouter.use('/envelopes', envelopesRouter);

module.exports = apiRouter

