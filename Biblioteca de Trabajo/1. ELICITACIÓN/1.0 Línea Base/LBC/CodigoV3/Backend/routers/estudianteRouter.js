const express = require('express');
const service = require('../service/estudianteService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - career
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-generado del estudiante
 *         name:
 *           type: string
 *           description: Nombre completo del estudiante
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           description: Correo electrónico del estudiante
 *           example: juan.perez@example.com
 *         password:
 *           type: string
 *           description: Contraseña del estudiante
 *           example: password123
 *         career:
 *           type: string
 *           description: Carrera del estudiante
 *           example: Ingeniería de Sistemas
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Estudiantes
 *   description: API para gestión de estudiantes
 */

/**
 * @swagger
 * /api/estudiantes:
 *   post:
 *     summary: Registrar un nuevo estudiante (registro público)
 *     tags: [Estudiantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - career
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               career:
 *                 type: string
 *                 example: Ingeniería de Sistemas
 *     responses:
 *       201:
 *         description: Estudiante creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudiante creado correctamente
 *                 content:
 *                   $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', async (req, res) => {
  try {
    const estudiante = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Estudiante creado correctamente',
      content: estudiante
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

/**
 * @swagger
 * /api/estudiantes:
 *   get:
 *     summary: Listar todos los estudiantes
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Lista de estudiantes
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Estudiante'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 *       500:
 *         description: Error del servidor
 */
router.get('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const estudiantes = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de estudiantes',
      content: estudiantes
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   get:
 *     summary: Obtener un estudiante por ID
 *     description: Solo técnico, admin o el propio estudiante pueden ver
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *         example: 65f1a9b4c12e3a001234abcd
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudiante encontrado
 *                 content:
 *                   $ref: '#/components/schemas/Estudiante'
 *       401:
 **
 * @swagger
 * /api/estudiantes/{id}:
 *   put:
 *     summary: Actualizar un estudiante
 *     description: Solo técnico, admin o el propio estudiante pueden actualizar
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               career:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudiante actualizado
 *                 content:
 *                   $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 */ *       403:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', auth, async (req, res) => {
  if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || req.user.id === req.params.id) {
    try {
      const estudiante = await service.findById(req.params.id);
      if (!estudiante) {
        return res.status(404).json({
          status: 'error',
          message: 'No encontrado',
          content: null
        });
      }
      res.json({
 **
 * @swagger
 * /api/estudiantes/{id}:
 *   delete:
 *     summary: Eliminar un estudiante
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Estudiante eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudiante eliminado
 *                 content:
 *                   $ref: '#/components/schemas/Estudiante'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */        message: 'Estudiante encontrado',
        content: estudiante
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message,
        content: null
      });
    }
  } else {
    res.status(403).json({
      status: 'error',
      message: 'No autorizado',
      content: null
    });
  }
});

// Actualizar estudiante (solo técnico, admin o el propio estudiante)

router.put('/:id', auth, async (req, res) => {
  if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || req.user.id === req.params.id) {
    try {
      const estudiante = await service.update(req.params.id, req.body);
      if (!estudiante) {
        return res.status(404).json({
          status: 'error',
          message: 'No encontrado',
          content: null
        });
      }
      res.json({
        status: 'success',
        message: 'Estudiante actualizado',
        content: estudiante
      });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
        content: null
      });
    }
  } else {
    res.status(403).json({
      status: 'error',
      message: 'No autorizado',
      content: null
    });
  }
});

// Eliminar estudiante (solo técnico o admin)

router.delete('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const estudiante = await service.delete(req.params.id);
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Estudiante eliminado',
      content: estudiante
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

module.exports = router;