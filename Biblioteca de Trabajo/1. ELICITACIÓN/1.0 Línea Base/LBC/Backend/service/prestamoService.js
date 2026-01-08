const Prestamo = require('../model/Prestamo');

module.exports = {
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
    return await Prestamo.findByIdAndDelete(id);
  }
};