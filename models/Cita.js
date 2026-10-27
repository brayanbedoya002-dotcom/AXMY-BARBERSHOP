const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nombreCliente: { type: String, required: true },
  telefono: { type: String, required: true },
  servicio: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cita', citaSchema);