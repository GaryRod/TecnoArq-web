import dbArticulos from'../models/articulosModel.js';
import dbArticuloAccesorios from'../models/articuloAccesoriosModel.js';
import dbAccesorios from'../models/accesoriosModel.js';
import dbMarcas from'../models/marcasModel.js';
import executeTransaction from'../helpers/transactionHelper.js';
import mercadoPago from'../helpers/mercadoPagoHelper.js';

const mainController = {
    index: async (req, res) => {
        await executeTransaction(async (connection) => {
            let articulos = await dbArticulos.getAll(connection);
            let articulosUtilizables = articulos.filter(art => art.utilizable);
            for (const articulo of articulosUtilizables)
                articulo.existeRefernecia = await dbArticuloAccesorios.existReferencesByCodArtUtilizables(connection, articulo.codigo);
            let marcas = await dbMarcas.getAll(connection);
            let marcasUtilizables = marcas.filter(marca => marca.utilizable);
            res.render('./index',{articulos: articulosUtilizables, marcas: marcasUtilizables})
        })
    },

    
  accesoriosArticulo: async (req, res) => {
    try {
      await executeTransaction(async (connection) => {
        const body = req.body;
        let accesorios = await dbAccesorios.getAll(connection);
        accesorios = accesorios.filter(acc => acc.utilizable)
        for (const accesorio of accesorios) {
          const accesorioArticulo = await dbArticuloAccesorios.findByIds(connection, body.codigoArt, accesorio.codigo)
          accesorio.existeAccesorioArticulo = accesorioArticulo ? true : false;
        }
        accesorios = accesorios.filter(acc => acc.existeAccesorioArticulo)
        res.json({accesorios});
      })
    } catch (error) {
      res.json({ hayError: true, mensaje: `Error inesperado, ${error.message}!` });
    }
  },

    comprar: async (req, res) => {
        const body = req.body;
        const response = await mercadoPago.crearOrden(body);
        res.json({url: response});
    },
    
    comprobar: async (req, res) => {
        await mercadoPago.validarPago(req,res);
    }
}

export default mainController