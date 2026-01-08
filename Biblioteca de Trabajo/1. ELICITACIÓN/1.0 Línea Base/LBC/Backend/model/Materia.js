const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  days: [{ type: String, required: true }],
});

module.exports = mongoose.model('Materia', MateriaSchema);