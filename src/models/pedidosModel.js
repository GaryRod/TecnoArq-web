import {connectToDatabase, sql} from '../database/sqlserver.js';

class Pedidos{
    constructor(numeroPedido, numeroComprador, codigoMP, totalPrecio, totalPrecioUSD){
        this.numeroPedido = numeroPedido;
        this.numeroComprador = numeroComprador;
        this.codigoMP = codigoMP;
        this.totalPrecio = totalPrecio;
        this.totalPrecioUSD = totalPrecioUSD;
    }

    static async insert(connection,numeroPedido, numeroComprador, codigoMP, totalPrecio, totalPrecioUSD){
        try {
            let [result] = await connection.execute('INSERT INTO PEDIDOS (NUMERO_PEDIDO,NUMERO_COMPRADOR_FK, CODIGO_PEDIDO_MP, TOTAL_PRECIO, TOTAL_PRECIO_USD) VALUES(?,?,?,?,?)',[numeroPedido, numeroComprador, codigoMP, totalPrecio, totalPrecioUSD]);
            return result;
        } catch (error) {
            throw new Error('Error al insertar pedido')
        }
    }

    
    static async maxID(connection){
        try {
            let [result] = await connection.query('SELECT IFNULL(MAX(NUMERO_PEDIDO),0) + 1 as proximoNumero FROM PEDIDOS');
            return result[0].proximoNumero;
        } catch (error) {
            throw new Error('Error al obtener último numero ID de pedido')
        }
    }

    static async getByCodigoMP(connection, codigoMP){
        try {
            let [result] = await connection.query('SELECT CODIGO_PEDIDO_MP as codigoMP FROM PEDIDOS WHERE CODIGO_PEDIDO_MP = ?', [codigoMP]);
            return result[0]?.codigoMP;
        } catch (error) {
            throw new Error('Error al obtener ID de compra mercado pago')
        }
    }
}

export default Pedidos;