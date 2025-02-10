import executeTransaction from'../helpers/transactionHelper.js';
import dbArticulos from'../models/articulosModel.js';
import dbArticulosPedidos from'../models/articulosPedidosModel.js';
import dbMarcas from'../models/marcasModel.js';
import {validationResult} from 'express-validator';

const adminController = {
  login: (req, res) => {
    res.render('./admin/login');
  },

  loginUser: (req, res) => {
    const errores = validationResult(req);
    if (errores.errors.length > 0 ) {
      return res.render('./admin/login',{
        errors: errores.mapped(),
        oldData: req.body
      })
    }
    const { username, password } = req.body;
    if (username === process.env.USER && password === process.env.USER_PASSWORD) {
      req.session.user = username;
      res.redirect('/admin/dashboard');
    } else {
      return res.render('./admin/login', {
        errors: {
            invalid: {msg: 'La contraseña o usuario no es válido'},
        },
        oldData: req.body
    })
    }
  },

  dashboard: async (req, res) => {
    await executeTransaction(async (connection) => {
        let articulos = await dbArticulos.getAll(connection);
        for (const articulo of articulos) {
          let existeArticulo = await dbArticulosPedidos.exist(connection, articulo.codigo);
          articulo.existeArticulo = existeArticulo;
        }
        let marcas = await dbMarcas.getAll(connection);
        res.render("./admin/editProducts", {articulos, marcas});
    })
  },

  logout: (req, res) => {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).send('Error al cerrar sesión.');
        }
        res.status(401).send('Sesión cerrada. Por favor, autentícate nuevamente.');
      });
  },

  updateArticulo: async (req, res) => {
    try {
      await executeTransaction(async (connection) => {
        const body = req.body;
        const precio = Number(body.precio.replace(".","").replace(",","."));
        const precioUSD = Number(body.precioUSD.replace(".","").replace(",","."))
        const utilizable = body.utilizable ? 1 : 0;
        await dbArticulos.update(connection, body.codigo, body.articulo, precio, precioUSD, utilizable);
      })
      res.json({ hayError: false });

    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  deleteArticulo: async (req, res) => {
    try {
      await executeTransaction(async (connection) => {
        const body = req.body;
        await dbArticulos.delete(connection, body.codigo);
      })
      res.json({ hayError: false });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  createArticulo: async (req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        let articulo = await dbArticulos.findById(connection, body.codigo);
        if (!articulo) {
          let precio = Number(body.precio.replace(".","").replace(",","."));
          let precioUSD = Number(body.precioUSD.replace(".","").replace(",","."));
          const utilizable = body.utilizable ? 1 : 0;
          await dbArticulos.insert(connection, body.codigo, body.articulo, precio, precioUSD, body.codigoMarca, utilizable);
        } else {
          error = "Código de artículo existente";
          hayError = true;
        }
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  createMarca: async (req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        let articulo = await dbMarcas.findById(connection, body.codigo);
        if (!articulo) {
          await dbMarcas.insert(connection, body.codigo, body.marca, body.utilizable);
        } else {
          error = "Código de marca existente";
          hayError = true;
        }
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  updateMarca: async (req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        await dbMarcas.update(connection, body.codigo, body.marca, body.utilizable);
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  }
};

export default adminController;
