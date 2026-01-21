const express = require('express');
const service = require('../service/dispositivoService');
const auth = require('../middleware/auth');
const router = express.Router();


const authorize = require('../middleware/authorize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Dispositivo:
 *       type: object
 *       required:
 *         - type
 *         - brand
 *         - model
 *         - location
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-generado del dispositivo
 *         type:
 *           type: string
 *           description: Tipo de dispositivo
 *           example: Laptop
 *         brand:
 *           type: string
 *           description: Marca del dispositivo
 *           example: Dell
 *         model:
 *           type: string
 *           description: Modelo del dispositivo
 *           example: Inspiron 15
 *         location:
 *           type: string
 *           description: Ubicación del dispositivo
 *           example: Laboratorio A
 *         status:
 *           type: string
 *           description: Estado del dispositivo
 *           example: Disponible
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
 *   name: Dispositivos
 *   description: API para gestión de dispositivos
 */

/**
 * @swagger
 * /api/dispositivos:
 *   post:
 *     summary: Crear un nuevo dispositivo
 *     tags: [Dispositivos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - brand
 *               - model
 *               - location
 *               - status
 *             properties:
 *               type:
 *                 type: string
 *                 example: Laptop
 *               brand:
 *                 type: string
 *                 example: Dell
 *               model:
 *                 type: string
 *                 example: Inspiron 15
 *               location:
 *                 type: string
 *                 example: Laboratorio A
 *               status:
 *                 type: string
 *                 example: Disponible
 *     responses:
 *       201:
 *         description: Dispositivo creado correctamente
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
 *                   example: Dispositivo creado correctamente
 *                 content:
 *                   $ref: '#/components/schemas/Dispositivo'
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 */
router.post('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const dispositivo = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Dispositivo creado correctamente',
      content: dispositivo
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
 * /api/dispositivos:
 *   get:
 *     summary: Listar todos los dispositivos
 *     tags: [Dispositivos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dispositivos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 **
 * @swagger
 * /api/dispositivos/{id}:
 *   get:
 *     summary: Obtener un dispositivo por ID
 *     tags: [Dispositivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del dispositivo
 *         example: 65f1a9b4c12e3a001234abcd
 *     responses:
 *       200:
 *         description: Dispositivo encontrado
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
 *                   example: Dispositivo encontrado
 *                 content:
 *                   $ref: '#/components/schemas/Dispositivo'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */ *                   type: string
 *                   example: Lista de dispositivos
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dispositivo'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/', auth, async (req, res) => {
  try {
    const dispositivos = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de dispositivos',
 **
 * @swagger
 * /api/dispositivos/{id}:
 *   put:
 *     summary: Actualizar un dispositivo
 *     tags: [Dispositivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               brand:
 *                 type: string
 **
 * @swagger
 * /api/dispositivos/{id}:
 *   delete:
 *     summary: Eliminar un dispositivo
 *     tags: [Dispositivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo eliminado
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
 *                   example: Dispositivo eliminado
 *                 content:
 *                   $ref: '#/components/schemas/Dispositivo'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */ *                 type: string
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dispositivo actualizado
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
 *                   example: Dispositivo actualizado
 *                 content:
 *                   $ref: '#/components/schemas/Dispositivo'
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 *       404:
 *         description: No encontrado
 */    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Ver dispositivo por id (todos autenticados)

router.get('/:id', auth, async (req, res) => {
  try {
    const dispositivo = await service.findById(req.params.id);
    if (!dispositivo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Dispositivo encontrado',
      content: dispositivo
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Actualizar dispositivo (solo técnico o admin)

router.put('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const dispositivo = await service.update(req.params.id, req.body);
    if (!dispositivo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Dispositivo actualizado',
      content: dispositivo
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Eliminar dispositivo (solo técnico o admin)

router.delete('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const dispositivo = await service.delete(req.params.id);
    if (!dispositivo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Dispositivo eliminado',
      content: dispositivo
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