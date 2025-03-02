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
      };
      let marcas = await dbMarcas.getAll(connection);
      for (const marca of marcas) {
        let existeArticuloMarca = await dbArticulosPedidos.existMarca(connection, marca.codigo);
        marca.existeArticuloMarca = existeArticuloMarca;
      };
      res.render("./admin/editProducts", {articulos, marcas});
    })
  },

  updateArticulo: async (req, res) => {
    try {
      let hayError = false;
      const errores = validationResult(req);
      hayError = errores.errors.length > 0;
      let mensajes;
      if (hayError) {
        mensajes = errores.mapped();
      } else {
        await executeTransaction(async (connection) => {
          const body = req.body;
          const precio = Number(body.precio.replace(".","").replace(",","."));
          const precioUSD = Number(body.precioUSD.replace(".","").replace(",","."))
          const utilizable = body.utilizable ? 1 : 0;
          await dbArticulos.update(connection, body.codigo, body.articulo, precio, precioUSD, utilizable);
        })
      }
      res.json({ hayError: hayError, mensaje: mensajes });

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
      let hayError = false;
      const errores = validationResult(req);
      hayError = errores.errors.length > 0;
      let mensajes;
      if (hayError) {
        mensajes = errores.mapped();
      } else {
        await executeTransaction(async (connection) => {
          const body = req.body;
          let precio = Number(body.precio.replace(".","").replace(",","."));
          let precioUSD = Number(body.precioUSD.replace(".","").replace(",","."));
          const utilizable = body.utilizable ? 1 : 0;
          await dbArticulos.insert(connection, body.codigo, body.articulo, precio, precioUSD, body.codigoMarca, utilizable);
        })
      }
      res.json({ hayError: hayError, mensaje: mensajes });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  createMarca: async (req, res) => {
    try {
      let hayError = false;
      let rutaImg;
      const errores = validationResult(req);
      hayError = errores.errors.length > 0;
      let mensajes;
      if (hayError) {
        mensajes = errores.mapped();
      } else {
        await executeTransaction(async (connection) => {
          const body = req.body;
          const imagen = req.file.filename;
          const utilizable = body.utilizable ? 1 : 0;
          await dbMarcas.insert(connection, body.codigo, body.marca, utilizable, imagen);
          rutaImg = await dbMarcas.findRutaImg(connection, body.codigo);
        })
      }
      res.json({ hayError: hayError, mensaje: mensajes, rutaImg: rutaImg });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

  updateMarca: async (req, res) => {
    try {
      let hayError = false;
      let rutaImg;
      const errores = validationResult(req);
      hayError = errores.errors.length > 0;
      let mensajes;
      if (hayError) {
        mensajes = errores.mapped();
      } else {
        await executeTransaction(async (connection) => {
          const body = req.body;
          const imagen = req.file ? req.file.filename : req.body.oldAvatar;
          const utilizable = body.utilizable ? 1 : 0;
          await dbMarcas.update(connection, body.codigo, body.marca, utilizable);
          if (imagen) {
            await dbMarcas.updateImg(connection, body.codigo, imagen);
            rutaImg = await dbMarcas.findRutaImg(connection, body.codigo);
          }
        })
      }
      res.json({ hayError: hayError, mensaje: mensajes, rutaImg: rutaImg });
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
      let hayError = false;
      const errores = validationResult(req);
      hayError = errores.errors.length > 0;
      let mensajes;
      if (hayError) {
        mensajes = errores.mapped();
      } else {
        await executeTransaction(async (connection) => {
          const body = req.body;
          await dbAccesoriosArticulo.deleteByIdArt(connection, body.codigoArticulo);
          for (const data of body.values) {
            await dbAccesoriosArticulo.insert(connection, body.codigoArticulo, data.codigoAccesorio)
          }
        })
      }
      res.json({ hayError: hayError, mensaje: mensajes });
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
      let hayError = false;
      const errores = validationResult(req);
      hayError = errores.errors.length > 0;
      let mensajes;
      if (hayError) {
        mensajes = errores.mapped();
      } else {
        await executeTransaction(async (connection) => {
          const body = req.body;
          const utilizable = body.utilizable ? 1 : 0;
          await dbAccesorios.update(connection, body.codigoAccesorio, body.nombreAccesorio, utilizable);
        })
      }
      res.json({ hayError: hayError, mensaje: mensajes });
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
      let hayError = false;
      const errores = validationResult(req);
      hayError = errores.errors.length > 0;
      let mensajes;
      if (hayError) {
        mensajes = errores.mapped();
      } else {
        await executeTransaction(async (connection) => {
          const body = req.body;
          const utilizable = body.utilizable ? 1 : 0;
          await dbAccesorios.insert(connection, body.codigoAccesorio, body.nombreAccesorio, utilizable);
        })
      }
      res.json({ hayError: hayError, mensaje: mensajes });
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },
};

export default adminController;
