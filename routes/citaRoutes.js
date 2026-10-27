const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const authMiddleware = require('../middleware/authMiddleware'); // 👈 'middleware' en singular

// Ruta para que el cliente autenticado vea sus propias citas
router.get('/mis-citas', authMiddleware, citaController.obtenerMisCitas);

// Rutas para el Administrador o generales
router.get('/', citaController.obtenerCitas);
router.post('/', authMiddleware, citaController.crearCita);
router.delete('/:id', authMiddleware, citaController.eliminarCita);

module.exports = router;