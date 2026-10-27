const mongoose = require('mongoose');
require('dotenv').config();
const Estilo = require('./models/Estilo');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/xxmy_barber_db';

const estilosIniciales = [
  {
    titulo: "El Degradado Ejecutivo (Fade)",
    descripcion: "El degradado ejecutivo, clásico y profesional para cualquier ocasión.",
    precio: 25,
    duracion: "20 min",
    categoria: "cortes",
    imagenUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
    orden: 1
  },
  {
    titulo: "El Ritual de Toalla Caliente y Barba",
    descripcion: "El ritual de toalla caliente y perfilado de barba tradicional completo.",
    precio: 45,
    duracion: "25 min",
    categoria: "barbas",
    imagenUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    orden: 2
  },
  {
    titulo: "Pompadour Moderno",
    descripcion: "Pompadour ejecutivo estilizado, clásico con volumen y acabado perfecto.",
    precio: 25,
    duracion: "20 min",
    categoria: "cortes",
    imagenUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
    orden: 3
  },
  {
    titulo: "El Paquete Signature AXMY",
    descripcion: "Paquete completo de corte de cabello y barba signature AXMY.",
    precio: 45,
    duracion: "30 min",
    categoria: "promociones",
    imagenUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    orden: 4
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB para sembrar datos...');
    await Estilo.deleteMany(); // Limpia los anteriores (opcional)
    await Estilo.insertMany(estilosIniciales);
    console.log('¡Estilos agregados exitosamente!');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));