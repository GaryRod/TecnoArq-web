import dbArticulos from'../models/articulosModel.js';
import dbMarcas from'../models/marcasModel.js';
import dbPedidos from'../models/pedidosModel.js';
import dbArticulosPedidos from'../models/articulosPedidosModel.js';
import dbCompradores from'../models/compradorModel.js';
import executeTransaction from'../helpers/transactionHelper.js';
import emailHelper from'../helpers/emailHelper.js';

const mainController = {
    index: async (req, res) => {
        await executeTransaction(async (transaction) => {
            let articulos = await dbArticulos.getAll(transaction);
            let marcas = await dbMarcas.getAll(transaction);
            res.render('./index',{articulos, marcas})
        })
    },

    comprar: async (req, res) => {
        const body = req.body;
        const { nombre, apellido, numeroDocumento , email, provincia, localidad, calle, numeroCalle, numeroCelular, carrito} = req.body
        let responseMail = await emailHelper(body);
        let mensajeError;
        if (!responseMail) {
            mensajeError = "Lo sentimos surgio un error inesperado al enviar el mail con el comprobante, contactese con el administrador."
        }
        await executeTransaction(async (transaction) => {
            let numeroComprador = await dbCompradores.maxID(transaction);
            await dbCompradores.insert(transaction, numeroComprador, nombre, apellido, numeroDocumento, email, calle, numeroCalle, localidad, provincia, numeroCelular);
            let numeroPedido = await dbPedidos.maxID(transaction);
            await dbPedidos.insert(transaction, numeroPedido, numeroComprador);
            for (const articulo of carrito) {
                await dbArticulosPedidos.insert(transaction, numeroPedido, articulo.codigo, articulo.cantidad, articulo.precio, articulo.preciousd);
            }
            res.json({respuestaMail: responseMail, mensaje: mensajeError})
        })
    }
}

export default mainController