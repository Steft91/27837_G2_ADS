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
    return await Prestamo.find({ userId: usuarioId })
      .populate({ path: 'userId', model: 'Estudiante', select: 'name email career' })
      .populate('idDispositivo');
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
      data.status = 'PENDIENTE_ENTREGA';
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
    return await Prestamo.find()
      .populate({ path: 'userId', model: 'Estudiante', select: 'name email career' })
      .populate('idDispositivo');
  },
  async findById(id) {
    return await Prestamo.findById(id);
  },
  async update(id, data) {
    return await Prestamo.findByIdAndUpdate(id, data, { new: true });
  },

  async validateCode(code) {
    const prestamo = await Prestamo.findOne({ code, status: 'PENDIENTE_ENTREGA' });
    if (!prestamo) {
      throw new Error('Código inválido o el préstamo no está pendiente de entrega');
    }

    // Validar que sea la fecha correcta (opcional, pero recomendado)
    // const now = new Date();
    // if (now < prestamo.start || now > prestamo.end) {
    //    throw new Error('El préstamo no puede ser validado fuera de su horario');
    // }

    return await Prestamo.findByIdAndUpdate(prestamo._id, { status: 'ACTIVO' }, { new: true });
  },
  async delete(id, userRole, userId) {
    // Verificar préstamo
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) throw new Error('Préstamo no encontrado');

    // Permisos: Solo el dueño o técnico/admin
    if (userRole === 'ESTUDIANTE' && String(prestamo.userId) !== userId) {
      throw new Error('No tienes permiso para anular este préstamo');
    }

    // Reglas de anulación
    // Estudiante solo puede anular si está PENDIENTE_ENTREGA
    if (userRole === 'ESTUDIANTE' && prestamo.status !== 'PENDIENTE_ENTREGA') {
      throw new Error('Solo puedes anular préstamos pendientes de entrega');
    }

    // Si ya está FINALIZADO o CANCELADO, no hacer nada (o lanzar error)
    if (['FINALIZADO', 'CANCELADO'].includes(prestamo.status)) {
      throw new Error('El préstamo ya está finalizado o cancelado');
    }

    // Anular préstamo y liberar dispositivo
    const prestamoActualizado = await Prestamo.findByIdAndUpdate(id, { status: 'CANCELADO' }, { new: true });

    // Si tenía dispositivo asignado, liberarlo
    if (prestamoActualizado.idDispositivo) {
      // Solo si NO estaba finalizado ya, liberamos (aunque la lógica de arriba ya filtra).
      // PERO ojo: Si estado era PENDIENTE_ENTREGA, el dispositivo YA estaba marcado como 'Prestado' en el create?
      // Revisemos create: create marca dispositivo como 'Prestado'.
      // Entonces sí, hay que liberarlo al cancelar PENDIENTE_ENTREGA.
      await Dispositivo.findByIdAndUpdate(prestamoActualizado.idDispositivo, { status: 'Disponible' });
    }
    return prestamoActualizado;
  },

  async findByLoanCode(code) {
    const prestamo = await Prestamo.findOne({ code })
      .populate({ path: 'userId', model: 'Estudiante', select: 'name email career' })
      .populate('idDispositivo');

    if (!prestamo) {
      throw new Error('Préstamo no encontrado con ese código');
    }
    return prestamo;
  },

  async finalize(id) {
    // 1. Obtener el préstamo
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) {
      throw new Error('Préstamo no encontrado');
    }

    // 2. Validar que no esté ya finalizado o cancelado
    if (prestamo.status === 'FINALIZADO' || prestamo.status === 'CANCELADO') {
      throw new Error('El préstamo ya está finalizado o cancelado');
    }

    // 3. Iniciar sesión para transacción
    const session = await mongoose.startSession();
    let prestamoActualizado;

    try {
      await session.withTransaction(async () => {
        // 4. Actualizar estado del préstamo a FINALIZADO
        prestamoActualizado = await Prestamo.findByIdAndUpdate(
          id,
          { status: 'FINALIZADO' },
          { new: true, session }
        );

        // 5. Liberar el dispositivo
        if (prestamo.idDispositivo) {
          await Dispositivo.findByIdAndUpdate(
            prestamo.idDispositivo,
            { status: 'Disponible' },
            { session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    return prestamoActualizado;
  }
};