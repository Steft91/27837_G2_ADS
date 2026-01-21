const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('🟢 Conectado a MongoDB');
    console.log('🟢 DB:', mongoose.connection.name);

  } catch (error) {
    console.error('🔴 Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
