const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura_axmy';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ success: false, error: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1]; // Formato: Bearer TOKEN

  try {
    const cifrado = jwt.verify(token, JWT_SECRET);
    
    // 🔍 Extraemos el ID sin importar cómo se haya llamado al firmar el token (id, _id, usuarioId, etc.)
    const idExtraido = cifrado.id || cifrado._id || cifrado.usuarioId || cifrado.uid;

    // Normalizamos req.usuario para que los controladores siempre encuentren el ID
    req.usuario = {
      ...cifrado,
      id: idExtraido,
      _id: idExtraido
    };
    
    req.admin = cifrado;   // Mantenido por compatibilidad
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado.' });
  }
}

module.exports = verificarToken;