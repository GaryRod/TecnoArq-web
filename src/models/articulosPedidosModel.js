import {connectToDatabase, sql} from '../database/sqlserver.js';

class ArticulosPedidos{
    constructor(numeroPedido, codigoArticulo, cantidad, precio, precioUSD){
        this.numeroPedido = numeroPedido;
        this.codigoArticulo = codigoArticulo;
        this.cantidad = cantidad;
        this.precio = precio;
        this.precioUSD = precioUSD;
    }

    static async insert(connection, numeroPedido, codigoArticulo, cantidad, precio, precioUSD){
        try {
            await connection.execute('INSERT INTO ARTICULOS_PEDIDOS (NUMERO_PEDIDO_FK,CODIGO_ARTICULO_FK,CANTIDAD_ARTICULO,PRECIO, PRECIO_USD) VALUES(?,?,?,?,?)', [numeroPedido, codigoArticulo, cantidad, precio, precioUSD]);
            return true;
        } catch (error) {
            throw new Error('Error al insertar artículos')
        }
    }

    static async exist(connection, codigoArticulo){
        try {
            let [returnDB] = await connection.query('SELECT (CASE WHEN EXISTS (SELECT 1 FROM ARTICULOS_PEDIDOS WHERE CODIGO_ARTICULO_FK = ?) THEN 1 ELSE 0 END) as existeArticulo', [codigoArticulo]);
            return returnDB[0].existeArticulo;
        } catch (error) {
            throw new Error('Error al obtener existencia de artículo en pedidos')
        }
    }
}

export default ArticulosPedidos;