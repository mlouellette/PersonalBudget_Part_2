const transactionsRouter = require("express").Router();
const Joi = require("joi");
const { pool, Pool } = require("../db/db");
const {transactionEnvelope} = require("../utils/joi");

module.exports = transactionsRouter;

// Create a new User
transactionsRouter.post("/create/:id", (request, response) => {
    const { payment_amount, payment_recipient } = request.body;
    const envelope_id = request.params.id;

    pool.query(
      "SELECT * FROM envelopes WHERE id = $1",
      [envelope_id],
      (error1, envResults) => {
        if (error1) {
          throw error1;
        }
  
        if (envResults.rowCount === 0) {
          return response.status(404).send(`Envelope not found with ID: ${envelope_id}`);
        }
  
    const { error } = transactionEnvelope(request.body);
    if (error) return response.status(404).send(error.details[0].message);
  
    pool.query(
      "INSERT INTO transactions (envelope_id, payment_amount, payment_recipient, date) VALUES  ((select id from envelopes where id = $1), $2, $3, current_timestamp) RETURNING *",
      [envelope_id, payment_amount, payment_recipient],
      (error, results) => {
        if (error) {
          throw error;
        }
        response
          .status(201)
          .send(
            `Content created with id: ${results.rows[0].id},\npayment amount: ${payment_amount},\nrecipient: ${payment_recipient}\nEnvelope ID: ${envelope_id}\nDate: ${new Date(Date.now())}`
          );
      }
    );
  });
});

// Helper function to retrieve envelopes and their contents
async function envByUser(envelopes) {
  const promiseEnv = envelopes.map(async (envelope) => {
    const { id } = envelope;
    const contents = await pool.query(
      "SELECT * FROM env_contents WHERE envelope_id = $1",
      [id]
    );

    return {
      envelope: envelope,
      contents: contents.rows,
    };
  });

  return Promise.all(promiseEnv);
}

// Get all users and their envelopes
transactionsRouter.get("/", async (request, response) => {
  try {
    const transactions = await pool.query(
      "SELECT * FROM transactions ORDER BY id ASC"
    );
    response.status(200).json(transactions.rows);
  } catch (error) {
    throw error;
  }
});

// Get a transaction by its ID
transactionsRouter.get("/:id", (request, response) => {
    const id = parseInt(request.params.id);
  
    pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  });

// Update a user by its ID
transactionsRouter.put("/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const { name } = request.body;

  pool.query(
    "UPDATE transactions SET name = $1 WHERE id = $3",
    [name, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
});

// Delete an envelope by its ID
transactionsRouter.delete("/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM transactions WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Transaction deleted with ID: ${id}`);
  });
});
