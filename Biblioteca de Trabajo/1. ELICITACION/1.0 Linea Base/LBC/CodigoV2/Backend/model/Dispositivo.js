const mongoose = require('mongoose');

const DispositivoSchema = new mongoose.Schema({
  type: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Dispositivo', DispositivoSchema);