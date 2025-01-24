import express from'express';
const router = express.Router();
// Solicito todas las funcionalidades del productController
import authMiddleware from'../middlewares/authMiddleware.js';
import adminController from'../controllers/adminController.js';

router.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <label for="username">Usuario:</label>
      <input type="text" id="username" name="username">
      <label for="password">Contraseña:</label>
      <input type="password" id="password" name="password">
      <button type="submit">Ingresar</button>
    </form>
  `);
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validamos las credenciales (ejemplo simple, puedes mejorar esto)
  if (username === 'admin' && password === '1234') {
    // Creamos una cookie para simular una sesión
    res.cookie('auth', 'true', { httpOnly: true, maxAge: 3600000 }); // 1 hora de duración
    res.redirect('/admin');
  } else {
    res.send('Credenciales incorrectas');
  }
});
// /* Con readAll - LISTADO DE PRODUCTOS, RENDERIZA CATALOGO DE PRODUCTOS*/
router.get('/', authMiddleware, adminController.dashboard);
// // router.get('/support', productController.support);
router.get('/logout', adminController.logout);

export default router