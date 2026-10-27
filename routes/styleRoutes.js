const express = require('express');
const router = express.Router();
const styleController = require('../controllers/styleController');
// const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware'); // Tus middlewares de protección

router.get('/', styleController.obtenerEstilos);
router.post('/', styleController.agregarEstilo); // Opcional: añade tus middlewares aquí (verificarToken, verificarAdmin)
router.delete('/:id', styleController.eliminarEstilo); // Ruta para borrar por ID
router.put('/:id', styleController.actualizarEstilo);

module.exports = router;