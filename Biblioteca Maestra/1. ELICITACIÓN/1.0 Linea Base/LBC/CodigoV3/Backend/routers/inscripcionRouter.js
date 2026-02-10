const express = require('express');
const service = require('../service/inscripcionService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Inscripcion:
 *       type: object
 *       required:
 *         - estudianteId
 *         - materiaId
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-generado de la inscripción
 *         estudianteId:
 *           type: string
 *           description: ID del estudiante
 *           example: 65f1a9b4c12e3a001234abcd
 *         materiaId:
 *           type: string
 *           description: ID de la materia
 *           example: 65f1a9b4c12e3a001234def0
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha de inscripción
 *           example: 2026-01-21
 */

/**
 * @swagger
 * tags:
 *   name: Inscripciones
 *   description: API para gestión de inscripciones
 */

/**
 * @swagger
 * /api/inscripciones:
 *   post:
 *     summary: Crear una nueva inscripción
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudianteId
 *               - materiaId
 *               - date
 *             properties:
 *               estudianteId:
 *                 type: string
 *                 example: 65f1a9b4c12e3a001234abcd
 *               materiaId:
 *                 type: string
 *                 example: 65f1a9b4c12e3a001234def0
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-21
 *     responses:
 *       201:
 *         description: Inscripción creada correctamente
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
 *                   example: Inscripción creada correctamente
 *                 content:
 *                   $ref: '#/components/schemas/Inscripcion'
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 */
router.post('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const inscripcion = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Inscripción creada correctamente',
      content: inscripcion
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
 * /api/inscripciones:
 *   get:
 *     summary: Listar todas las inscripciones
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones
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
 *                   example: Lista de inscripciones
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inscripcion'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/', auth, async (req, res) => {
  try {
    const inscripciones = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de inscripciones',
      content: inscripciones
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
 * /api/inscripciones/{id}:
 *   get:
 *     summary: Obtener una inscripción por ID
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inscripción
 *         example: 65f1a9b4c12e3a001234abcd
 *     responses:
 *       200:
 *         description: Inscripción encontrada
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
 *                   example: Inscripción encontrada
 *                 content:
 *                   $ref: '#/components/schemas/Inscripcion'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const inscripcion = await service.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Inscripción encontrada',
      content: inscripcion
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
 * /api/inscripciones/{id}:
 *   put:
 *     summary: Actualizar una inscripción
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inscripción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudianteId:
 *                 type: string
 *               materiaId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Inscripción actualizada
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
 *                   example: Inscripción actualizada
 *                 content:
 *                   $ref: '#/components/schemas/Inscripcion'
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 *       404:
 *         description: No encontrado
 */
router.put('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const inscripcion = await service.update(req.params.id, req.body);
    if (!inscripcion) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Inscripción actualizada',
      content: inscripcion
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
 * /api/inscripciones/{id}:
 *   delete:
 *     summary: Eliminar una inscripción
 *     tags: [Inscripciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inscripción
 *     responses:
 *       200:
 *         description: Inscripción eliminada
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
 *                   example: Inscripción eliminada
 *                 content:
 *                   $ref: '#/components/schemas/Inscripcion'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const inscripcion = await service.delete(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Inscripción eliminada',
      content: inscripcion
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