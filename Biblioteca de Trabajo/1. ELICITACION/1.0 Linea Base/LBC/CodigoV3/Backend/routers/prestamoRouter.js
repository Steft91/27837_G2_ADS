
const express = require('express');
const service = require('../service/prestamoService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Prestamo:
 *       type: object
 *       required:
 *         - userId
 *         - userRole
 *         - idClase
 *         - status
 *         - start
 *         - end
 *         - idDispositivo
 *         - code
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-generado del préstamo
 *         userId:
 *           type: string
 *           description: ID del usuario que realiza el préstamo
 *           example: 65f1a9b4c12e3a001234abcd
 *         userRole:
 *           type: string
 *           enum: [ESTUDIANTE, DOCENTE, ADMIN]
 *           description: Rol del usuario
 *           example: ESTUDIANTE
 *         idClase:
 *           type: string
 *           description: ID de la clase relacionada
 *           example: clase123
 *         status:
 *           type: string
 *           enum: [ACTIVO, FINALIZADO, MORA, CANCELADO]
 *           description: Estado del préstamo
 *           example: ACTIVO
 *         start:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio del préstamo
 *         end:
 *           type: string
 *           format: date-time
 *           description: Fecha de fin del préstamo
 *         idDispositivo:
 *           type: string
 *           description: ID del dispositivo prestado
 *           example: 65f1a9b4c12e3a001234def0
 *         code:
 *           type: string
 *           description: Código único del préstamo
 *           example: PRE-2026-001
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
 *   name: Préstamos
 *   description: API para gestión de préstamos de dispositivos
 */

/**
 * @swagger
 * /api/prestamos:
 *   post:
 *     summary: Crear un préstamo de dispositivo
 *     description: |
 *       Permite a un estudiante solicitar un préstamo de un dispositivo
 *       para una fecha y hora específicas.
 *       El sistema valida que el rango solicitado esté dentro del horario
 *       de una materia en la que el estudiante esté inscrito y asigna
 *       automáticamente un dispositivo disponible del tipo solicitado.
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoDispositivo
 *               - start
 *               - end
 *             properties:
 *               tipoDispositivo:
 *                 type: string
 *                 description: Tipo de dispositivo a prestar
 *                 example: PROYECTOR
 *               start:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio del préstamo
 *                 example: 2026-02-01T10:00:00
 *               end:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de fin del préstamo
 *                 example: 2026-02-01T12:00:00
 *     responses:
 *       201:
 *         description: Préstamo creado correctamente
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
 *                   example: Préstamo creado correctamente
 *                 content:
 *                   $ref: '#/components/schemas/Prestamo'
 *       400:
 *         description: |
 *           Error de validación:
 *           - Datos incompletos
 *           - Fuera del horario de clase
 *           - Fechas inválidas
 *           - No hay dispositivos disponibles
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ESTUDIANTE)
 */
router.post('/', auth, authorize(['ESTUDIANTE']), async (req, res) => {
  try {
    const prestamo = await service.create(req.body, req.user);
    res.status(201).json({
      status: 'success',
      message: 'Préstamo creado correctamente',
      content: prestamo
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
 * /api/prestamos:
 *   get:
 *     summary: Listar préstamos
 *     description: El técnico/admin ve todos, el estudiante solo los suyos
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos
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
 *                   example: Lista de préstamos
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prestamo'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/', auth, async (req, res) => {
  try {
    let prestamos;
    if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN') {
      prestamos = await service.findAll();
    } else {
      prestamos = await service.getHistorialPrestamosByUsuario(req.user.id);
    }
    res.json({
      status: 'success',
      message: 'Lista de préstamos',
      content: prestamos
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
 * /api/prestamos/historial:
 *   get:
 *     summary: Obtener historial de préstamos del usuario autenticado
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos del usuario
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
 *                   example: Historial obtenido correctamente
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prestamo'
 */
router.get('/historial', auth, async (req, res) => {
  try {
    const prestamos = await service.getHistorialPrestamosByUsuario(req.user.id);
    res.json({
      status: 'success',
      message: 'Historial obtenido correctamente',
      content: prestamos
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * @swagger
 * /api/prestamos/activo:
 *   get:
 *     summary: Obtener el préstamo activo del usuario autenticado
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Préstamo activo encontrado
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
 *                   example: Préstamo activo encontrado
 *                 content:
 *                   $ref: '#/components/schemas/Prestamo'
 *       404:
 *         description: El usuario no tiene préstamos activos
 */
router.get('/activo', auth, async (req, res) => {
  try {
    const prestamo = await service.getPrestamoActivoByUsuario(req.user.id);
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'No tienes ningún préstamo activo en este momento',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Préstamo activo encontrado',
      content: prestamo
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * @swagger
 * /api/prestamos/{id}:
 *   get:
 *     summary: Obtener préstamo por ID
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo
 *         example: 65f1a9b4c12e3a001234abcd
 *     responses:
 *       200:
 *         description: Préstamo encontrado
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
 *                   example: Préstamo encontrado
 *                 content:
 *                   $ref: '#/components/schemas/Prestamo'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const prestamo = await service.findById(req.params.id);
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || String(prestamo.userId) === req.user.id) {
      res.json({
        status: 'success',
        message: 'Préstamo encontrado',
        content: prestamo
      });
    } else {
      res.status(403).json({
        status: 'error',
        message: 'No autorizado',
        content: null
      });
    }
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
 * /api/prestamos/{id}:
 *   put:
 *     summary: Actualizar préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVO, FINALIZADO, MORA, CANCELADO]
 *                 example: DEVUELTO
 *     responses:
 *       200:
 *         description: Préstamo actualizado
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
 *                   example: Préstamo actualizado
 *                 content:
 *                   $ref: '#/components/schemas/Prestamo'
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
    const prestamo = await service.update(req.params.id, req.body);
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Préstamo actualizado',
      content: prestamo
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
 * /api/prestamos/{id}:
 *   delete:
 *     summary: Anular préstamo
 *     description: El estudiante solo puede anular el suyo, el técnico cualquiera
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo
 *     responses:
 *       200:
 *         description: Préstamo anulado
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
 *                   example: Préstamo anulado
 *                 content:
 *                   $ref: '#/components/schemas/Prestamo'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const prestamo = await service.findById(req.params.id);
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || String(prestamo.userId) === req.user.id) {
      const anulado = await service.delete(req.params.id);
      res.json({
        status: 'success',
        message: 'Préstamo anulado',
        content: anulado
      });
    } else {
      res.status(403).json({
        status: 'error',
        message: 'No autorizado',
        content: null
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

module.exports = router;