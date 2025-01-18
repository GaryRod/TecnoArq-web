const adminController = {
// Ruta para el área protegida (admin)
  dashboard: async (req, res) => {
        res.send(`<h1>Bienvenido ${req.session.user} a la página de administración</h1><p>Aquí puedes ajustar los precios de los productos</p>`);
  },
  logout: (req, res) => {
      // Forzar una respuesta 401 para que el navegador olvide las credenciales
      req.session.destroy(err => {
        if (err) {
          return res.status(500).send('Error al cerrar sesión.');
        }
        res.status(401).send('Sesión cerrada. Por favor, autentícate nuevamente.');
      });
}
};

module.exports = adminController;
