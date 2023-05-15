const transactionsRouter = require("express").Router();

const transactionRouter = require("../controller/transactions-controller");
transactionsRouter.use("/transactions", transactionRouter);

module.exports = transactionsRouter;
