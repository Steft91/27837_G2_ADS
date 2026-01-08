const Materia = require('../model/Materia');

module.exports = {
  async create(data) {
    return await Materia.create(data);
  },
  async findAll() {
    return await Materia.find();
  },
  async findById(id) {
    return await Materia.findById(id);
  },
  async findByNombre(nombre) {
    return await Materia.find({ nombre });
  },
  async findByUbicacion(ubicacion) {
    return await Materia.find({ ubicacion });
  },
  async update(id, data) {
    return await Materia.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return await Materia.findByIdAndDelete(id);
  }
};