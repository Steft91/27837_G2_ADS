const express = require('express');
const jwt = require('jsonwebtoken');
const Estudiante = require('../model/Estudiante');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña requeridos.' });
  }
  try {
    // Buscar en estudiante para iniciar sesión
    const estudiante = await Estudiante.findOne({ correo });

    // Si no se encuentra en estudiantes, se busca en admin
    if(!estudiante){
      const admin = (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) ? { correo: email, nombre: 'Admin' } : null;
    }


    if (!user || user.contraseña !== contraseña) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const token = jwt.sign(
      { id: user._id, correo: user.correo, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

module.exports = router;
