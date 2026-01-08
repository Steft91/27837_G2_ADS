const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dispositivoRouter = require('./routers/dispositivoRouter');
const estudianteRouter = require('./routers/estudianteRouter');
const inscripcionRouter = require('./routers/inscripcionRouter');
const materiaRouter = require('./routers/materiaRouter');
const prestamoRouter = require('./routers/prestamoRouter');
const loginRouter = require('./routers/login');

const app = express();
app.use(express.json());

app.use('/api/login', loginRouter);

// Rutas
app.use('/api/dispositivos', dispositivoRouter);
app.use('/api/estudiantes', estudianteRouter);
app.use('/api/inscripciones', inscripcionRouter);
app.use('/api/materias', materiaRouter);
app.use('/api/prestamos', prestamoRouter);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('Conectado a MongoDB'))
	.catch(err => console.error('Error de conexión a MongoDB:', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en puerto ${PORT}`);
});
