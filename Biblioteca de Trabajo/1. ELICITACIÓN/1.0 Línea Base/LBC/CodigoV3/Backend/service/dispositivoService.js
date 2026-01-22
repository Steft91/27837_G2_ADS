const Dispositivo = require('../model/Dispositivo');

function validateDispositivo(data) {
  const requiredFields = ['type', 'brand', 'model', 'location', 'status'];
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      throw new Error(`El campo '${field}' es obligatorio y debe ser un string no vacío.`);
    }
  }
  const validStatuses = ['Disponible', 'Mantenimiento', 'Dañado', 'Prestado'];
  if (!validStatuses.includes(data.status)) {
    throw new Error(`El estado debe ser uno de: ${validStatuses.join(', ')}.`);
  }
}

module.exports = {
  async create(data) {
    validateDispositivo(data);
    return await Dispositivo.create(data);
  },
  async findAll() {
    return await Dispositivo.find();
  },
  async findById(id) {
    return await Dispositivo.findById(id);
  },
  async update(id, data) {
    validateDispositivo(data);
    return await Dispositivo.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return await Dispositivo.findByIdAndDelete(id);
  }
};