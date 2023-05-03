const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));