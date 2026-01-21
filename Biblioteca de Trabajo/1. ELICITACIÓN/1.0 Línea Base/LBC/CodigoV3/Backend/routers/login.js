
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión (estudiante, técnico o admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT y rol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Estudiante = require('../model/Estudiante');
require('dotenv').config();

const router = express.Router();


router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Correo y contraseña requeridos.',
      content: null
    });
  }
  try {
    // Buscar en estudiante para iniciar sesión
    const estudiante = await Estudiante.findOne({ email });
    console.log('EMAIL BUSCADO:', email);
    console.log('ESTUDIANTE ENCONTRADO:', estudiante);
    console.log('DB:', mongoose.connection.name);
    console.log('COLECCIÓN:', Estudiante.collection.name);

    let user = null;
    let role = null;
    if (estudiante && estudiante.password === password) {
      user = estudiante;
      role = 'ESTUDIANTE';
    } else if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      user = { _id: 'admin', email, name: 'Admin' };
      role = 'ADMIN';
    } else if (email === process.env.TECNICO_EMAIL && password === process.env.TECNICO_PASSWORD) {
      user = { _id: 'tecnico', email, name: 'Técnico' };
      role = 'TECNICO';
    }
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas.',
        content: null
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      status: 'success',
      message: 'Login exitoso',
      content: { token, role }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor.',
      content: null
    });
  }
});

module.exports = router;
