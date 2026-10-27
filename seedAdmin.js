const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Usuario = require('./models/Usuario');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/xxmy_barber_db';

async function crearAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB...');

    // Borrar admin anterior si existe para evitar duplicados
    await Usuario.deleteOne({ email: 'admin@axmy.com' });

    const passwordCifrada = await bcrypt.hash('admin123', 10);

    const nuevoAdmin = new Usuario({
      nombre: 'Super Administrador',
      email: 'admin@axmy.com',
      password: passwordCifrada,
      rol: 'admin' // ¡Forzamos el rol de admin!
    });

    await nuevoAdmin.save();
    console.log('¡Administrador creado con éxito!');
    console.log('Correo: admin@axmy.com');
    console.log('Contraseña: admin123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

crearAdmin();