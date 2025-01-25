import {connectToDatabase, sql} from '../database/sqlserver.js';

class Pedidos{
    constructor(numeroPedido, numeroComprador){
        this.numeroPedido = numeroPedido;
        this.numeroComprador = numeroComprador;
    }

    static async insert(transaction,numeroPedido, numeroComprador){
        // const pool = await connectToDatabase();
        const result = await transaction.request()
            .input('numeroPedido', sql.Int, numeroPedido)
            .input('numeroComprador', sql.Int, numeroComprador)
            .query('INSERT INTO PEDIDOS (NUMERO_PEDIDO,NUMERO_COMPRADOR_FK) VALUES(@numeroPedido,@numeroComprador)');
        // await pool.close();
        return result;
    }

    
    static async maxID(transaction){
        let result = await transaction.request()
            .query('SELECT ISNULL(MAX(NUMERO_PEDIDO),0) + 1 as proximoNumero FROM PEDIDOS');
        return result.recordset[0].proximoNumero;
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

export default Pedidos;