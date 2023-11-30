let express = require('express');
let router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const { Notes } = require("../models");

// POST
router.post('/', async (req, res, next) => {
  // Validation
  const schema = {
    title: 'string',
    description: 'string'
  };

  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Proses Create
  const note = await Notes.create(req.body);
  res.json({
    status: 200,
    message: "Success",
    data: note,
  })
})

// GET
router.get("/", async (req, res, next) => {
  const notes = await Notes.findAll();
  return res.json({
    status: 200,
    message: 'Success get all data',
    data: notes,
  });
});

// GET by ID
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  let note = await Notes.findByPk(id);
  return !note ?
    res.status(404).json({ status: 404, message: 'Data Not Found' }) :
    res.json({ status: 200, message: 'Success Get Data', data: note })
});


// PUT
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  let note = await Notes.findByPk(id);
  if (!note) {
    return res.status(404).json({
      status: 404,
      message: 'Data Not Found'
    });
  }

  // Validate
  const schema = {
    title: "string|optional",
    description: "string|optional",
  }

  const validate = v.validate(req.body, schema)
  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Update process
  note = await note.update(req.body);
  res.json({
    status: 200,
    message: 'Success updated data',
    data: note
  });
});

// Remove Data By ID
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  let note = await Notes.findByPk(id);
  if (!note) {
    return res.status(404).json({ status: 404, message: 'Data Not Found' });
  }

  await note.destroy();
  res.json({
    status: 200,
    message: "Success Delete Data",
  });
});

module.exports = router;