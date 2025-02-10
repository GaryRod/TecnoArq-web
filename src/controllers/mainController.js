import dbArticulos from'../models/articulosModel.js';
import dbMarcas from'../models/marcasModel.js';
import executeTransaction from'../helpers/transactionHelper.js';
import mercadoPago from'../helpers/mercadoPagoHelper.js';

const mainController = {
    index: async (req, res) => {
        await executeTransaction(async (connection) => {
            let articulos = await dbArticulos.getAll(connection);
            let articulosUtilizables = articulos.filter(art => art.utilizable )
            let marcas = await dbMarcas.getAll(connection);
            let marcasUtilizables = marcas.filter(marca => marca.utilizable )
            res.render('./index',{articulos: articulosUtilizables, marcas: marcasUtilizables})
        })
    },

    comprar: async (req, res) => {
        const body = req.body;
        const response = await mercadoPago.crearOrden(body)
        res.json({url: response})
    },
    
    comprobar: async (req, res) => {
        await mercadoPago.validarPago(req,res)
    },

    comprobarGet: async (req, res) => {
        const status = req.query.status || "Desconocido";
        let pagoRealizado = false;
        if (status === "approved") {
            pagoRealizado = true;
        }
        res.render('./informacionPago',{pagoRealizado})
    }
}

export default mainController