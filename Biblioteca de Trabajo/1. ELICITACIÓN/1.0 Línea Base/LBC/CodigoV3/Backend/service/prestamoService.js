const Prestamo = require('../model/Prestamo');

const Dispositivo = require('../model/Dispositivo');
const Inscripcion = require('../model/Inscripcion');
const Materia = require('../model/Materia');
const mongoose = require('mongoose');

function normalizarDia(dia) {
  return dia
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

module.exports = {
  async getHistorialPrestamosByUsuario(usuarioId) {
    return await Prestamo.find({ userId: usuarioId });
  },
  async getPrestamoActivoByUsuario(usuarioId) {
    return await Prestamo.findOne({ userId: usuarioId, status: 'ACTIVO' });
  },
  async create(data, user) {
    // 🔹 Validación básica
    if (!data.tipoDispositivo || !data.start || !data.end) {
      throw new Error('tipoDispositivo, start y end son obligatorios');
    }

    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    const now = new Date();

    if (isNaN(startDate) || isNaN(endDate)) {
      throw new Error('Formato de fecha inválido');
    }

    if (startDate >= endDate) {
      throw new Error('La fecha de inicio debe ser menor a la fecha de fin');
    }

    if (startDate < now) {
      throw new Error('No puedes solicitar préstamos en el pasado');
    }

    // 🔹 Validación académica
    if (user.role === 'ESTUDIANTE') {
      const inscripciones = await Inscripcion.find({
        estudianteId: user.id
      });

      if (!inscripciones.length) {
        throw new Error('No tienes materias inscritas');
      }

      const materias = await Materia.find({
        _id: { $in: inscripciones.map(i => i.materiaId) }
      });

      const diaSemana = startDate.toLocaleString('es-EC', {
        weekday: 'long'
      });

      const diaNormalizado = normalizarDia(diaSemana);

      const minutosInicio =
        startDate.getHours() * 60 + startDate.getMinutes();
      const minutosFin =
        endDate.getHours() * 60 + endDate.getMinutes();

      const materiaValida = materias.find(m => {
        const materiaInicio = m.start * 60;
        const materiaFin = m.end * 60;

        const diasMateriaNormalizados = m.days.map(normalizarDia);

        return (
          diasMateriaNormalizados.includes(diaNormalizado) &&
          minutosInicio >= materiaInicio &&
          minutosFin <= materiaFin
        );
      });

      if (!materiaValida) {
        throw new Error(
          'El préstamo debe estar dentro de tu horario de clase'
        );
      }

      data.idClase = materiaValida._id;
    }

    // 🔹 Transacción (control de concurrencia)
    const session = await mongoose.startSession();
    let prestamoCreado;

    await session.withTransaction(async () => {
      const dispositivo = await Dispositivo.findOneAndUpdate(
        {
          type: data.tipoDispositivo,
          status: 'Disponible'
        },
        {
          $set: { status: 'Prestado' }
        },
        {
          new: true,
          session
        }
      );

      if (!dispositivo) {
        throw new Error('No hay dispositivos disponibles de este tipo');
      }

      data.idDispositivo = dispositivo._id;
      data.userId = user.id;
      data.userRole = user.role;
      data.status = 'ACTIVO';
      data.code = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

      prestamoCreado = await Prestamo.create([data], { session });
    });

    await session.endSession();
    return prestamoCreado[0];
  },
  async findAll() {
    return await Prestamo.find();
  },
  async findById(id) {
    return await Prestamo.findById(id);
  },
  async update(id, data) {
    return await Prestamo.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    // Anular préstamo y liberar dispositivo
    const prestamo = await Prestamo.findByIdAndUpdate(id, { status: 'CANCELADO' }, { new: true });
    if (prestamo && prestamo.idDispositivo) {
      await Dispositivo.findByIdAndUpdate(prestamo.idDispositivo, { status: 'Disponible' });
    }
    return prestamo;
  }
};