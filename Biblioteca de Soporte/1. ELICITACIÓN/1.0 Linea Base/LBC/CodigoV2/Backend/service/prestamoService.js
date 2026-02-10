const Prestamo = require('../model/Prestamo');

module.exports = {
  async getHistorialPrestamosByUsuario(usuarioId) {
    return await Prestamo.find({ usuario: usuarioId });
  },
  async getPrestamoActivoByUsuario(usuarioId) {
    return await Prestamo.findOne({ usuario: usuarioId, estado: 'ACTIVO' });
  },
  async create(data) {
    return await Prestamo.create(data);
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
    return await Prestamo.findByIdAndUpdate(id, { estado: 'CANCELADO' }, { new: true });
  }
};