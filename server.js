const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES Y LÍMITES (10MB para imágenes en Base64) ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 1. Servir archivos estáticos desactivando el index automático de la carpeta public
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// 2. Forzar que la ruta raíz (/) cargue obligatoriamente el login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 3. Tus rutas de la API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/estilos', require('./routes/styleRoutes'));
app.use('/api/citas', require('./routes/citaRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// 4. Conexión a MongoDB y arranque del servidor
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/xxmy_barber_db';

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('⚡ Conectado exitosamente a MongoDB (XXMY DB)'))
        .catch(err => console.error('❌ Error al conectar a MongoDB:', err.message));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en el puerto http://localhost:${PORT}`);
    });
}

module.exports = app;