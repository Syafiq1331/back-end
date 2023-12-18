let express = require('express');
let router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const { prismaClient } = require('../services/database/database');
// const { notifyCustomerInvoiceConfirmedAction } = require('../services/message/handler');

// POST
router.post('/', async (req, res, next) => {
  // Validation
  const schema = {
    name: 'string|required',
    whatsapp_number: { type: "string", numeric: true, positive: true },
    token_listrik_customer: 'string|required',
    product_id: { type: "string", integer: true, positive: true }
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

  const productDetail = await prismaClient.product.findFirst({
    where: {
      id: parseInt(req.body.product_id)
    },
    select: {
      id: true,
      name: true,
      price: true
    }
  })

  if (!productDetail) {
    return res.status(422).json({
      status: 422,
      message: "product not found"
    })
  }

  const { id: productId, name: productName, price: productPrice } = productDetail

  // Generate unique invoice number
  const invoiceNumber = generateUniqueInvoiceNumber(); // Implement this function

  // Process Create
  const customer = await prismaClient.customerOrder.create({
    data: {
      name: req.body.name,
      whatsappNumber: req.body.whatsapp_number,
      tokenListrikCustomer: req.body.token_listrik_customer,
      invoiceNumber, productId, productName, productPrice: productPrice.toString()
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
  const customers = await prismaClient.customerOrder.findMany()
  return res.json({
    status: 200,
    message: 'Success get all data',
    data: customers,
  });
});

// GET by ID
router.get("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  let customers = await prismaClient.customerOrder.findUnique({
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
  const id = parseInt(req.params.id);
  let customers = await prismaClient.customerOrder.findUnique({
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
    tokenListrikCustomer: 'string',
  };

  const validate = v.validate(req.body, schema)
  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Update process
  const updatedToken = await prismaClient.customerOrder.update({
    where: {
      id: customers.id
    },
    data: {
      name: schema.name,
      whatsappNumber: schema.no_whatsapp,
      tokenListrikCustomer: schema.tokenListrikCustomer
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
  const id = parseInt(req.params.id);
  let customers = await prismaClient.customerOrder.findUnique({
    where: {
      id
    }
  })
  if (!customers) {
    return res.status(404).json({ status: 404, message: 'Data Not Found' });
  }

  await prismaClient.customerOrder.delete({
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