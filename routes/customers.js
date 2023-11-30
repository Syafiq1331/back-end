let express = require('express');
let router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const { Customer } = require("../models");

// POST
router.post('/', async (req, res, next) => {
  // Validation
  const schema = {
    name: 'string|required',
    no_whatsapp: 'string',
    tokenId: 'string',
  };

  function generateUniqueInvoiceNumber() {
    // Logic to generate a unique invoice number
    // For example, you can combine current timestamp with a random number
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  }

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Generate unique invoice number
  const no_invoice = generateUniqueInvoiceNumber(); // Implement this function

  // Process Create
  const customer = await Customer.create({ ...req.body, no_invoice });

  return res.json({
    status: 200,
    message: 'Success',
    data: customer,
  });
});

// GET
router.get("/", async (req, res, next) => {
  const customer = await Customer.findAll();
  return res.json({
    status: 200,
    message: 'Success get all data',
    data: customer,
  });
});

// GET by ID
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  let customer = await Customer.findByPk(id);
  return !customer ?
    res.status(404).json({ status: 404, message: 'Data Not Found' }) :
    res.json({ status: 200, message: 'Success Get Data', data: customer })
});

// PUT
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  let customer = await Customer.findByPk(id);
  if (!customer) {
    return res.status(404).json({
      status: 404,
      message: 'Data Not Found'
    });
  }

  // Validation
  const schema = {
    name: 'string|required',
    no_whatsapp: 'string',
    tokenId: 'string',
  };

  const validate = v.validate(req.body, schema)
  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Update process
  const updatedToken = await customer.update(req.body, { returning: true });
  res.json({
    status: 200,
    message: 'Success updated data',
    data: updatedToken
  });
});

// Remove Data By ID
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  let customer = await Customer.findByPk(id);
  if (!customer) {
    return res.status(404).json({ status: 404, message: 'Data Not Found' });
  }

  await customer.destroy();
  res.json({
    status: 200,
    message: "Success Delete Data",
  });
});


module.exports = router;