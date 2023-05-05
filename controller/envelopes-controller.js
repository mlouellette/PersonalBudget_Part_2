const envelopesRouter = require("express").Router();
const Joi = require("joi");
const { pool, Pool } = require("../db/db");
const validateEnvelope = require("../utils/joi");

module.exports = envelopesRouter;

// Create a new User
envelopesRouter.post("/create", (req, res) => {
  const { name } = req.body;

  pool.query(
    "INSERT INTO envelopes (name) VALUES ($1) RETURNING *",
    [name],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
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
envelopesRouter.get("/", async (request, response) => {
  try {
    const envelopes = await pool.query(
      "SELECT * FROM envelopes ORDER BY id ASC"
    );
    const userWithEnvelope = await envByUser(envelopes.rows);
    response.status(200).json(userWithEnvelope);
  } catch (error) {
    throw error;
  }
});

// Get a user by its ID and their associated envelopes
envelopesRouter.get("/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM envelopes WHERE id = $1",
    [id],
    (error, userResults) => {
      if (error) {
        throw error;
      }

      if (userResults.rowCount === 0) {
        return response.status(404).send(`User not found with ID: ${id}`);
      }

      const user = userResults.rows[0];
      console.log(user);

      pool.query(
        "SELECT * FROM env_contents WHERE envelope_id = $1",
        [id],
        (error, envelopeResults) => {
          if (error) {
            throw error;
          }

          const envelopes = envelopeResults.rows;

          response.status(200).json({
            user: user,
            envelopes: envelopes,
          });
        }
      );
    }
  );
});

// Update a user by its ID
envelopesRouter.put("/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const { name } = request.body;

  pool.query(
    "UPDATE envelopes SET name = $1 WHERE id = $3",
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
envelopesRouter.delete("/:id", (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM envelopes WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Envelope deleted with ID: ${id}`);
  });
});
