const Estilo = require('../models/Estilo');

// Obtener todos
exports.obtenerEstilos = async (req, res) => {
  try {
    const estilos = await Estilo.find();
    res.json({ success: true, estilos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Agregar nuevo
exports.agregarEstilo = async (req, res) => {
  try {
    const { titulo, descripcion, precio, duracion, categoria, imagenUrl } = req.body;
    const nuevoEstilo = new Estilo({ titulo, descripcion, precio, duracion, categoria, imagenUrl });
    await nuevoEstilo.save();
    res.json({ success: true, mensaje: 'Publicado con éxito', estilo: nuevoEstilo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Actualizar producto existente (NUEVO)
exports.actualizarEstilo = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    
    const actualizado = await Estilo.findByIdAndUpdate(id, datosActualizados, { new: true });
    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Elemento no encontrado.' });
    }
    
    res.json({ success: true, mensaje: 'Actualizado con éxito', estilo: actualizado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Eliminar
exports.eliminarEstilo = async (req, res) => {
  try {
    const { id } = req.params;
    await Estilo.findByIdAndDelete(id);
    res.json({ success: true, mensaje: 'Eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};