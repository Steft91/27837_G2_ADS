const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const connectDB = require('./config/database');

const dispositivoRouter = require('./routers/dispositivoRouter');
const estudianteRouter = require('./routers/estudianteRouter');
const inscripcionRouter = require('./routers/inscripcionRouter');
const materiaRouter = require('./routers/materiaRouter');
const prestamoRouter = require('./routers/prestamoRouter');
const loginRouter = require('./routers/login');

const allowedOrigins = [
  process.env.FRONTEND_URL,     
  'http://localhost:3000',      
  'http://localhost:5173'      
];


const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  credentials: true
}));

app.use(express.json());

// 🔥 Conectar a MongoDB ANTES de usar rutas
connectDB();

// Swagger docs
require('./swagger')(app);

// Rutas
app.use('/api/login', loginRouter);
app.use('/api/dispositivos', dispositivoRouter);
app.use('/api/estudiantes', estudianteRouter);
app.use('/api/inscripciones', inscripcionRouter);
app.use('/api/materias', materiaRouter);
app.use('/api/prestamos', prestamoRouter);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

module.exports = app;
