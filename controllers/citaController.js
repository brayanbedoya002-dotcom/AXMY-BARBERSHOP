const Cita = require('../models/Cita'); // Asegúrate de que el modelo apunte a tu esquema de citas

// Crear una nueva cita (Para el Cliente)
exports.crearCita = async (req, res) => {
  try {
    const { servicio, nombre, telefono, fecha, hora } = req.body;
    
    // Obtenemos el ID del cliente autenticado a través del token JWT
    const clienteId = req.usuario ? (req.usuario._id || req.usuario.id) : null;

    const nuevaCita = new Cita({
      servicio,
      nombreCliente: nombre, // 👈 Solucionado: Mapeamos el nombre al campo que exige tu esquema
      telefono,
      fecha,
      hora,
      cliente: clienteId
    });

    await nuevaCita.save();
    res.status(201).json({ success: true, cita: nuevaCita });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener todas las citas agendadas (Para el Admin)
exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find().sort({ fecha: 1, hora: 1 });
    res.json({ success: true, citas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener solo las citas del cliente autenticado (Para la vista del Cliente)
exports.obtenerMisCitas = async (req, res) => {
  try {
    const clienteId = req.usuario._id || req.usuario.id;
    const citas = await Cita.find({ cliente: clienteId }).sort({ fecha: 1, hora: 1 });
    res.json({ success: true, citas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar / Cancelar una cita (Para el Admin o el Cliente)
exports.eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const citaEliminada = await Cita.findByIdAndDelete(id);

    if (!citaEliminada) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada.' });
    }

    res.json({ success: true, mensaje: 'Cita eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};