const mongoose = require('mongoose');

const estiloSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  duracion: { type: String }, // Opcional, útil para cortes
  categoria: { 
    type: String, 
    required: true, 
    enum: ['cortes', 'cabello', 'barberos'] // <- Las 3 categorías solicitadas por el cliente
  },
  imagenUrl: { type: String, required: true },
  stock: { type: Number, default: 10 }, // Opcional, útil para productos físicos
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Estilo', estiloSchema);