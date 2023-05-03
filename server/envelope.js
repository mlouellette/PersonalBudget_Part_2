const envelopesRouter = require('express').Router();
const Joi = require('joi');

module.exports = envelopesRouter

const { envelopes, secondEnvelope } = require('./db');

// Retrieve all envelopes in the database
envelopesRouter.get('/', (req, res) => {
    res.send(envelopes);

});

envelopesRouter.get('/secondEnvelope', (req, res) => {
    res.send(secondEnvelope);

});

// Retrieve a specific envelope in the database
envelopesRouter.get('/:id', (req, res) => {
    const envelope = envelopes.find(c => c.id === parseInt(req.params.id));
    if (!envelope) return res.status(404).send("envelope not found");

    res.send(envelope);

});


// Create a new envelope object
envelopesRouter.post('/', (req, res) => {
    const { error } = validateEnvelope(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const envelope = {
        id: envelopes.length + 1,
        name: req.body.name,
        price: req.body.price

    }
    envelopes.push(envelope);
    res.send(envelope);

});

// Update an envelope
envelopesRouter.put('/:id', (req, res) => {
    const envelope = envelopes.find(c => c.id === parseInt(req.params.id));
    if (!envelope) return res.status(404).send("envelope not found");

    const { error } = validateEnvelope(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    envelope.name = req.body.name;
    envelope.price = req.body.price;

    res.send(envelope);

});

// Delete an envelope
envelopesRouter.delete('/:id', (req, res) => {
    const envelope = envelopes.find(c => c.id === parseInt(req.params.id));
    if (!envelope) return res.status(404).send("envelope not found");

    const index = envelopes.indexOf(envelope);
    envelopes.splice(index, 1);

    res.send(envelope);

});

envelopesRouter.get('/lol/:john', (req, res) => {

    res.send(req.params);

});

// POST transfer one envelope from one array to another
envelopesRouter.post('/transfer/:from/:to', (req,res) => {
    const envelope = envelopes.find(c => c.id === parseInt(req.params.from));
    if (!envelope) {
      const envelope2 = secondEnvelope.find(c => c.id === parseInt(req.params.from));
      if (!envelope2) return res.status(404).send("envelope not found");
  
      const index = secondEnvelope.indexOf(envelope2);
      envelopes.push(envelope2);
      secondEnvelope.splice(index, 1);
    } else {
      const index = envelopes.indexOf(envelope);
      secondEnvelope.push(envelope);
      envelopes.splice(index, 1);
    }
  
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send("Transfer successful");
  });   

// Input validation function for schema
function validateEnvelope(envelope) {
    const schema = {
        name: Joi.string().min(3).required(),
        price: Joi.number().required()

    };
    return Joi.validate(envelope, schema);

}