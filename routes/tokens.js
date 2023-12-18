let express = require('express');
let router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const { prismaClient } = require('../services/database/database');

// POST
router.post('/', async (req, res, next) => {
  // Validation
  const schema = {
    nama: 'string|required',
    price: 'string',
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Check if 'nama' is unique in the 'tokens' table
  const existingToken = await prismaClient.token.findUnique({
    where: {
      nama: req.body.nama
    }
  })
  if (existingToken) {
    return res.status(400).json({ message: 'Nama must be unique for tokens' });
  }

  // Process Create
  const token = await prismaClient.token.create({
    data: req.body
  })
  return res.json({
    status: 200,
    message: 'Success',
    data: token,
  });
});

// GET
router.get("/", async (req, res, next) => {
  const token = await prismaClient.token.findMany()
  return res.json({
    status: 200,
    message: 'Success get all data',
    data: token,
  });
});

// GET by ID
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  let token = await prismaClient.token.findUniqueOrThrow({
    where: {
      id
    }
  })
  return !token ?
    res.status(404).json({ status: 404, message: 'Data Not Found' }) :
    res.json({ status: 200, message: 'Success Get Data', data: token })
});

// PUT
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  let token = await prismaClient.token.findUniqueOrThrow({
    where: {
      id
    }
  })
  if (!token) {
    return res.status(404).json({
      status: 404,
      message: 'Data Not Found'
    });
  }

  // Validate
  const schema = {
    nama: "string|required",
    price: "string",
  }

  const validate = v.validate(req.body, schema)
  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Update process
  const updatedToken = await prismaClient.token.update({
    where: {
      id
    }, data: req.body
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
  let token = await prismaClient.token.findUniqueOrThrow({
    where: {
      id
    }
  })
  if (!token) {
    return res.status(404).json({ status: 404, message: 'Data Not Found' });
  }

  await prismaClient.token.delete({
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