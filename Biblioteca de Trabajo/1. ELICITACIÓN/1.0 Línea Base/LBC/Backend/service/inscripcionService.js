const Inscripcion = require('../model/Inscripcion');

module.exports = {
  async create(data) {
    return await Inscripcion.create(data);
  },
  async findAll() {
    return await Inscripcion.find();
  },
  async findById(id) {
    return await Inscripcion.findById(id);
  },
  async findByEstudianteId(estudianteId) {
    return await Inscripcion.find({ estudianteId });
  },
  async findByMateriaId(materiaId) {
    return await Inscripcion.find({ materiaId });
  },
  async update(id, data) {
    return await Inscripcion.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return await Inscripcion.findByIdAndDelete(id);
  }
};