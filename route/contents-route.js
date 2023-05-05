const contentsRouter = require('express').Router();

const contentRouter = require('../controller/contents-controller');
contentsRouter.use('/contents', contentRouter);

module.exports = contentsRouter

