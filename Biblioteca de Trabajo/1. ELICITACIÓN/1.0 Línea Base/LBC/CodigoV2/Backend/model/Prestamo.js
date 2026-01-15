const mongoose = require('mongoose');

const PrestamoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, equired: true },
  userRole: { type: String, enum: ['ESTUDIANTE', 'DOCENTE', 'ADMIN'], required: true },
  idClase: { type: String, required: true },
  status: { type: String, enum: ['ACTIVO', 'FINALIZADO', 'MORA', 'CANCELADO'], required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  idDispositivo: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispositivo', required: true },
  code: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Prestamo', PrestamoSchema);