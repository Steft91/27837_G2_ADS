const Estudiante = require('../model/Estudiante');

module.exports = {
  async create(data) {
    return await Estudiante.create(data);
  },
  async findAll() {
    return await Estudiante.find();
  },
  async findById(id) {
    return await Estudiante.findById(id);
  },
  async findByCorreo(correo) {
    return await Estudiante.findOne({ correo });
  },
  async update(id, data) {
    return await Estudiante.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return await Estudiante.findByIdAndDelete(id);
  }
};