const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura_axmy';

// Iniciar sesión (Admin o Cliente)
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      success: true,
      mensaje: '¡Bienvenido!',
      token,
      rol: usuario.rol // ¡Esto es clave para que el navegador sepa si es admin o cliente!
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Registrar nuevo usuario (Cliente)
exports.registrarUsuario = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ success: false, error: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      email,
      password: hashedPassword,
      nombre,
      rol: 'cliente'
    });

    await nuevoUsuario.save();
    res.json({ success: true, mensaje: '¡Registro exitoso! Ya puedes iniciar sesión.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};