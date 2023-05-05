const envelopesRouter = require("express").Router();

const envelopeRouter = require("../controller/envelopes-controller");
envelopesRouter.use("/envelopes", envelopeRouter);

module.exports = envelopesRouter;
