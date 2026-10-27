const mongoose = require('mongoose');

const styleSchema = new mongoose.Schema({
  nombreCorto: { type: String, required: true },
  descripcionLarga: { type: String },
  precio: { type: Number, required: true },
  duracionMinutos: { type: Number, required: true },
  imagenUrl: { type: String }
}, {
  timestamps: true,
  collection: 'styles' // Asegura que use tu colección existente en MongoDB
});

module.exports = mongoose.model('Style', styleSchema);