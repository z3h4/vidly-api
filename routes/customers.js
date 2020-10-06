const express = require('express');
const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');
const router = express.Router();

router.get('/', async (req, res) => {
  console.log(req);
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    res.status(404).send('Customer with the given ID was not found');

  res.send(customer);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, phone, isGold } = req.body;
  const customer = new Customer({
    name: name,
    phone: phone,
    isGold: isGold
  });

  await customer.save();
  res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, phone, isGold } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      phone: phone,
      isGold: isGold
    },
    { new: true }
  );

  if (!customer)
    res.status(404).send('Customer with the given ID was not found');

  res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    res.status(404).send('Customer with the given ID was not found');

  res.send(customer);
});

module.exports = router;
