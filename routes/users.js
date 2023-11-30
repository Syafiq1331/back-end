let express = require('express');
let router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const { User } = require("../models");
const bcrypt = require('bcrypt');

// POST untuk membuat atau mengirim data pengguna
router.post('/', async (req, res, next) => {
  // Validasi
  const schema = {
    nama: 'string|required',
    email: 'string|required',
    password: 'string|required',
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  // Periksa apakah email sudah digunakan
  const existingUser = await User.findOne({ where: { email: req.body.email } });

  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah digunakan' });
  }

  // Enkripsi kata sandi sebelum menyimpannya
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // Angka 10 adalah saltRounds

  // Proses pembuatan data pengguna
  try {
    const user = await User.create({
      nama: req.body.nama,
      email: req.body.email,
      password: hashedPassword, // Simpan kata sandi yang sudah dienkripsi
    });

    return res.status(201).json({
      status: 201,
      message: 'Data pengguna berhasil dibuat',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan saat memproses permintaan' });
  }
});

// GET
router.get("/", async (req, res, next) => {
  const user = await User.findAll();
  return res.json({
    status: 200,
    message: 'Success get all data',
    data: user,
  });
});

// GET by ID
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  let user = await User.findByPk(id);
  return !user ?
    res.status(404).json({ status: 404, message: 'Data Not Found' }) :
    res.json({ status: 200, message: 'Success Get Data', data: user })
});

// PUT
router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const { nama, email, password } = req.body;

  // Validasi data
  if (!nama || !email) {
    return res.status(400).json({ message: 'Nama dan email wajib diisi' });
  }

  try {
    // Cari pengguna berdasarkan ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Data pengguna tidak ditemukan' });
    }

    // Jika password diubah, enkripsi password baru
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Enkripsi password baru
      user.password = hashedPassword;
    }

    // Perbarui data pengguna
    user.nama = nama;
    user.email = email;

    await user.save();

    return res.status(200).json({ message: 'Data pengguna berhasil diperbarui', data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan saat memproses permintaan' });
  }
});

// remove Data By ID
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  let user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ status: 404, message: 'Data Not Found' });
  }

  await user.destroy();
  res.json({
    status: 200,
    message: "Success Delete Data",
  });
});

module.exports = router;