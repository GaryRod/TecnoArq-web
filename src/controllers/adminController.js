import executeTransaction from'../helpers/transactionHelper.js';
import dbArticulos from'../models/articulosModel.js';
import dbArticulosPedidos from'../models/articulosPedidosModel.js';
import dbMarcas from'../models/marcasModel.js';
import dbAccesorios from'../models/accesoriosModel.js';
import dbAccesoriosArticulo from'../models/articuloAccesoriosModel.js';
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
    console.log("usuario enviado " + username)
    console.log("constrasenia enviada " + password)
    console.log("usuario env " + process.env.USER_ACCESS )
    console.log("constrasenia env " + process.env.USER_PASSWORD)

    if (username === process.env.USER_ACCESS && password === process.env.USER_PASSWORD) {
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

  logout: (req, res) => {
    req.session.destroy();
    return res.redirect('/admin');
  },

  dashboard: async (req, res) => {
    await executeTransaction(async (connection) => {
      let articulos = await dbArticulos.getAll(connection);
      for (const articulo of articulos) {
        let existeArticulo = await dbArticulosPedidos.existArticle(connection, articulo.codigo);
        articulo.existeArticulo = existeArticulo;
      }
      let marcas = await dbMarcas.getAll(connection);
      for (const marca of marcas) {
        let existeArticuloMarca = await dbArticulosPedidos.existMarca(connection, marca.codigo);
        marca.existeArticuloMarca = existeArticuloMarca;
      }
      res.render("./admin/editProducts", {articulos, marcas});
    })
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
  },

  deleteMarca: async (req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        await dbMarcas.delete(connection, body.codigo);
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  getAccesoriosArticulo: async (req, res) => {
    try {
      await executeTransaction(async (connection) => {
        const body = req.body;
        let accesorios = await dbAccesorios.getAll(connection);
        accesorios = accesorios.filter(acc => acc.utilizable)
        for (const accesorio of accesorios) {
          const existeAccesorioArticulo = await dbAccesoriosArticulo.existAccesorie(connection, body.codigoArt, accesorio.codigo)
          accesorio.existeAccesorioArticulo = existeAccesorioArticulo;
        }
        res.json({accesorios});
      })
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  
  grabarAccesoriosArticulo: async (req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        await dbAccesoriosArticulo.deleteByIdArt(connection, body.codigoArticulo);
        for (const data of body.values) {
          await dbAccesoriosArticulo.insert(connection, body.codigoArticulo, data.codigoAccesorio)
        }
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

    
  getAccesorios: async (req, res) => {
    try {
      await executeTransaction(async (connection) => {
        let accesorios = await dbAccesorios.getAll(connection);
        for (const accesorio of accesorios) {
           accesorio.existeReferenciaArticulo = await dbAccesoriosArticulo.existReferencesByCodAccesorie(connection, accesorio.codigo)
        }
        res.json({accesorios});
      })
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  updateAccesorio: async(req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        await dbAccesorios.update(connection, body.codigoAccesorio, body.nombre, body.utilizable);
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  deleteAccesorio: async (req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        await dbAccesorios.delete(connection, body.codigoAccesorio);
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  
  createAccesorio: async (req, res) => {
    try {
      let error;
      let hayError = false;
      await executeTransaction(async (connection) => {
        const body = req.body;
        let accesorio = await dbAccesorios.findById(connection, body.codigoAccesorio);
        if (!accesorio) {
          await dbAccesorios.insert(connection, body.codigoAccesorio, body.nombre, body.utilizable);
        } else {
          error = "Código de accesorio existente";
          hayError = true;
        }
      })
      res.json({ hayError: hayError, mensaje: error });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },
};

export default adminController;
