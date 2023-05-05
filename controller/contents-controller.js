const contentsRouter = require("express").Router();
const { pool } = require("../db/db");
const { validateEnvelope, updateEnvelope } = require("../utils/joi");

module.exports = contentsRouter;

// create new content related to a envelope
contentsRouter.post("/create/:id", (request, response) => {
  const { title, amount } = request.body;
  const envelope_id = request.params.id;

  const { error } = validateEnvelope(request.body);
  if (error) return response.status(404).send(error.details[0].message);

  pool.query(
    "INSERT INTO env_contents (envelope_id, title, amount) VALUES  ((select id from envelopes where id = $1), $2, $3) RETURNING *",
    [envelope_id, title, amount],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .send(
          `Content created with id: ${results.rows[0].id} for Envelope ID: ${envelope_id}`
        );
    }
  );
});

// Transfer content from one envelope to another envelope
contentsRouter.post("/transfer/:from/:to", async (request, response) => {
  const from = parseInt(request.params.from);
  const to = parseInt(request.params.to);

  try {
    const fromResult = await pool.query(
      "SELECT * FROM env_contents WHERE id = $1",
      [from]
    );
    const toResult = await pool.query("SELECT * FROM envelopes WHERE id = $1", [
      to,
    ]);

    if (fromResult.rowCount === 0) {
      return response.status(404).send(`Envelope id: ${from} Invalid`);
    } else if (toResult.rowCount === 0) {
      return response.status(404).send(`User id: ${to} Invalid`);
    }

    await pool.query("UPDATE env_contents SET envelope_id = $1 WHERE id = $2", [
      to,
      from,
    ]);

    response
      .status(200)
      .send(`Content ID: ${from} transfered to envelope ID: ${to}`);
  } catch (error) {
    throw error;
  }
});

// Get all envelope contents in ascending order by ID
contentsRouter.get("/", (request, response) => {
  pool.query("SELECT * FROM env_contents ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
});

// Get envelope content by its ID
contentsRouter.get("/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM env_contents WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});

// Update the amount of an envelope content by its ID
contentsRouter.put("/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const { amount } = request.body;

  const { error } = updateEnvelope(request.body);
  if (error) return response.status(404).send(error.details[0].message);

  pool.query(
    "UPDATE env_contents SET amount = $1 WHERE id = $2",
    [amount, id],
    (error, results) => {
      if (results.rowCount === 0) {
        return response.status(404).send(`ID ${id} doesn't exist`);
      } else if (error) {
        throw error;
      }
      response.status(200).send(`Content modified with ID: ${id}`);
    }
  );
});

// Delete an envelope content by its ID
contentsRouter.delete("/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM env_contents WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Content deleted with ID: ${id}`);
    }
  );
});
