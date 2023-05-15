const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Apply the body-parser middleware to handle JSON and URL-encoded data
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Mount the contentsRouter at the '/api' path
const conRouter = require('./route/contents-route');
app.use('/api', conRouter);

// Mount the envelopesRouter at the '/api' path
const envRouter = require('./route/envelopes-route');
app.use('/api', envRouter);

// Mount the transactionsRouter at the '/api' path
const transRouter = require('./route/transactions-route');
app.use('/api', transRouter);

// Default route that responds with "hello world"
app.get('/', (request, response) => {
    response.send("hello world")
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

module.exports = function() { 
  return 'hello1';

};