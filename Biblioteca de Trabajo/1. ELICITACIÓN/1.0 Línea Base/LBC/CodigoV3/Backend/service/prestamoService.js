const Prestamo = require('../model/Prestamo');

const Dispositivo = require('../model/Dispositivo');
const Inscripcion = require('../model/Inscripcion');
const Materia = require('../model/Materia');
const mongoose = require('mongoose');

module.exports = {
  async getHistorialPrestamosByUsuario(usuarioId) {
    return await Prestamo.find({ userId: usuarioId });
  },
  async getPrestamoActivoByUsuario(usuarioId) {
    return await Prestamo.findOne({ userId: usuarioId, status: 'ACTIVO' });
  },
  async create(data, user) {
    if (user.role === 'ESTUDIANTE') {
      const inscripciones = await Inscripcion.find({ estudianteId: user.id });
      if (!inscripciones.length) throw new Error('No tienes materias inscritas.');
      const materias = await Materia.find({ _id: { $in: inscripciones.map(i => i.materiaId) } });
      const now = new Date();
      const diaSemana = now.toLocaleString('es-EC', { weekday: 'long' });
      const hora = now.getHours();
      const materiaValida = materias.find(m => m.days.includes(diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)) && hora >= m.start && hora < m.end);
      if (!materiaValida) throw new Error('Solo puedes solicitar préstamos dentro de tu horario de clase.');
      data.idClase = materiaValida._id;
    }

    // Asignar dispositivo disponible del tipo solicitado (manejo de concurrencia)
    const session = await mongoose.startSession();
    let prestamoCreado = null;
    await session.withTransaction(async () => {
      // Buscar dispositivo disponible del tipo solicitado
      const dispositivo = await Dispositivo.findOneAndUpdate(
        { type: data.tipoDispositivo, status: 'Disponible' },
        { $set: { status: 'Prestado' } },
        { new: true, session }
      );
      if (!dispositivo) throw new Error('No hay dispositivos disponibles de este tipo.');
      // Crear préstamo
      data.idDispositivo = dispositivo._id;
      data.userId = user.id;
      data.userRole = user.role;
      data.status = 'ACTIVO';
      data.start = new Date();
      data.end = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas por defecto
      data.code = Math.random().toString(36).substring(2, 10).toUpperCase();
      prestamoCreado = await Prestamo.create([data], { session });
    });
    await session.endSession();
    return prestamoCreado ? prestamoCreado[0] : null;
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