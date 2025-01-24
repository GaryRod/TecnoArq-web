import dbArticulos from'../models/articulosModel.js';
import dbMarcas from'../models/marcasModel.js';
import dbPedidos from'../models/pedidosModel.js';
import dbArticulosPedidos from'../models/articulosPedidosModel.js';
import dbCompradores from'../models/compradorModel.js';
import executeTransaction from'../helpers/transactionHelper.js';

const mainController = {
    index: async (req, res) => {
        await executeTransaction(async (transaction) => {
            let articulos = await dbArticulos.getAll(transaction);
            let marcas = await dbMarcas.getAll(transaction);
            res.render('./index',{articulos, marcas})
        })
    },

    comprar: async (req, res) => {
        await executeTransaction(async (transaction) => {
            let articulos = await dbArticulos.getAll(transaction);
            let marcas = await dbMarcas.getAll(transaction);
            const { nombre, apellido, numeroDocumento , email, provincia, localidad, calle, numeroCalle, carrito} = req.body
            let numeroComprador = await dbCompradores.maxID(transaction);
            await dbCompradores.insert(transaction, numeroComprador, nombre, apellido, numeroDocumento, email, calle, numeroCalle, localidad, provincia);
            let numeroPedido = await dbPedidos.maxID(transaction);
            await dbPedidos.insert(transaction, numeroPedido, numeroComprador);
            for (const articulo of carrito) {
                await dbArticulosPedidos.insert(transaction, numeroPedido, articulo.codigo, articulo.cantidad, articulo.precio, articulo.preciousd);
            }
            
            res.json({compraExistosa: true})
        })
    }
}

export default mainController