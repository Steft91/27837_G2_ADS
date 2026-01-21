const express = require('express');
const service = require('../service/materiaService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Materia:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - start
 *         - end
 *         - days
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-generado de la materia
 *         name:
 *           type: string
 *           description: Nombre de la materia
 *           example: Programación Web
 *         location:
 *           type: string
 *           description: Ubicación de la clase
 *           example: Aula 302
 *         start:
 *           type: number
 *           description: Hora de inicio (formato 24h)
 *           example: 14
 *         end:
 *           type: number
 *           description: Hora de fin (formato 24h)
 *           example: 16
 *         days:
 *           type: array
 *           items:
 *             type: string
 *           description: Días de la semana
 *           example: ["Lunes", "Miércoles"]
 */

/**
 * @swagger
 * tags:
 *   name: Materias
 *   description: API para gestión de materias
 */

/**
 * @swagger
 * /api/materias:
 *   post:
 *     summary: Crear una nueva materia
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - start
 *               - end
 *               - days
 *             properties:
 *               name:
 *                 type: string
 *                 example: Programación Web
 *               location:
 *                 type: string
 *                 example: Aula 302
 *               start:
 *                 type: number
 *                 example: 14
 *               end:
 *                 type: number
 *                 example: 16
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Lunes", "Miércoles"]
 *     responses:
 *       201:
 *         description: Materia creada correctamente
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
 *                   example: Materia creada correctamente
 *                 content:
 *                   $ref: '#/components/schemas/Materia'
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo TECNICO o ADMIN)
 */
router.post('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const materia = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Materia creada correctamente',
      content: materia
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
 * /api/materias:
 *   get:
 *     summary: Listar todas las materias
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de materias
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
 *                   example: Lista de materias
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Materia'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/', auth, async (req, res) => {
  try {
    const materias = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de materias',
      content: materias
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
 * /api/materias/{id}:
 *   get:
 *     summary: Obtener una materia por ID
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la materia
 *         example: 65f1a9b4c12e3a001234abcd
 *     responses:
 *       200:
 *         description: Materia encontrada
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
 *                   example: Materia encontrada
 *                 content:
 *                   $ref: '#/components/schemas/Materia'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const materia = await service.findById(req.params.id);
    if (!materia) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Materia encontrada',
      content: materia
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
 * /api/materias/{id}:
 *   put:
 *     summary: Actualizar una materia
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la materia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               start:
 *                 type: number
 *               end:
 *                 type: number
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Materia actualizada
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
 *                   example: Materia actualizada
 *                 content:
 *                   $ref: '#/components/schemas/Materia'
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
    const materia = await service.update(req.params.id, req.body);
    if (!materia) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Materia actualizada',
      content: materia
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
 * /api/materias/{id}:
 *   delete:
 *     summary: Eliminar una materia
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la materia
 *     responses:
 *       200:
 *         description: Materia eliminada
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
 *                   example: Materia eliminada
 *                 content:
 *                   $ref: '#/components/schemas/Materia'
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
    const materia = await service.delete(req.params.id);
    if (!materia) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Materia eliminada',
      content: materia
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