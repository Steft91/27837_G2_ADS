const mongoose = require('mongoose');

const InscripcionSchema = new mongoose.Schema({
  estudianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
  materiaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  fechaInscripcion: { type: Date, required: true },
});

module.exports = mongoose.model('Inscripcion', InscripcionSchema);