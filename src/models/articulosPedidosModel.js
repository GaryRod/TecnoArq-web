import {connectToDatabase, sql} from '../database/sqlserver.js';

class ArticulosPedidos{
    constructor(numeroPedido, codigoArticulo, cantidad, precio, precioUSD){
        this.numeroPedido = numeroPedido;
        this.codigoArticulo = codigoArticulo;
        this.cantidad = cantidad;
        this.precio = precio;
        this.precioUSD = precioUSD;
    }

    static async insert(transaction, numeroPedido, codigoArticulo, cantidad,precio, preciousd){
        await transaction.request()
            .input('numeroPedido', sql.Int, numeroPedido)
            .input('codigoArticulo', sql.VarChar, codigoArticulo)
            .input('cantidad', sql.Int, cantidad)
            .input('precio', sql.Decimal, precio)
            .input('preciousd', sql.Decimal, preciousd)
            .query('INSERT INTO ARTICULOS_PEDIDOS (NUMERO_PEDIDO_FK,CODIGO_ARTICULO_FK,CANTIDAD_ARTICULO,PRECIO,PRECIO_USD) VALUES(@numeroPedido,@codigoArticulo,@cantidad,@precio,@preciousd)');
        return true;
    }

    // static async getAll(req, res) {
    //     try {
    //         const pool = await connectToDatabase();
    //         const resultsBD = await pool.request().query('SELECT CODIGO_MARCA as codigo, NOMBRE_MARCA as nombre FROM MARCAS');
    //         const results = resultsBD.recordset.map(art => new Marca(
    //             art.codigo,
    //             art.nombre
    //         ));
    //         await pool.close();
    //         return results;
    //     } catch (error) {
    //         console.error('Error al obtener articulos:', error);
    //         res.status(500).send('Error al obtener usuarios');
    //     }
    // }
}

export default ArticulosPedidos;