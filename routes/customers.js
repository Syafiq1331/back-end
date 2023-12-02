let express = require('express');
let router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const { prismaClient } = require('../services/database/database');

// POST
router.post('/', async (req, res, next) => {
  // Validation
  const schema = {
    name: 'string|required',
    whatsapp_number: 'string',
    token_id: 'string',
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
  const invoiceNumber = generateUniqueInvoiceNumber(); // Implement this function

  // Process Create
  const customer = await prismaClient.customer.create({
    data: {
      ...req.body, invoiceNumber
    }
  })

  return res.json({
    status: 200,
    message: 'Success',
    data: customer,
  });
});

// GET
router.get("/", async (req, res, next) => {
  const customers = await prismaClient.customer.findMany()
  return res.json({
    status: 200,
    message: 'Success get all data',
    data: customers,
  });
});

// GET by ID
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  let customers = await prismaClient.customer.findUnique({
    where: {
      id
    }
  })
  return !customers ?
    res.status(404).json({ status: 404, message: 'Data Not Found' }) :
    res.json({ status: 200, message: 'Success Get Data', data: customers })
});

// PUT
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  let customers = await prismaClient.customer.findUnique({
    where: {
      id
    }
  })
  if (!customers) {
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
  const updatedToken = await prismaClient.customer.update({
    where: {
      id: customers.id
    },
    data: {
      ...req.body
    }
  })
  res.json({
    status: 200,
    message: 'Success updated data',
    data: updatedToken
  });
});

// Remove Data By ID
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  let customers = await prismaClient.customer.findUnique({
    where: {
      id
    }
  })
  if (!customers) {
    return res.status(404).json({ status: 404, message: 'Data Not Found' });
  }

  await prismaClient.customer.delete({
    where: {
      id
    }
  })

  res.json({
    status: 200,
    message: "Success Delete Data",
  });
});


module.exports = router;