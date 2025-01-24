import {connectToDatabase, sql} from '../database/sqlserver.js';

class Comprador{
    constructor(numeroComprador, nombreComprador, apellidoComprador, numeroDNI, email, calle, numeroCalle, localidad, provincia){
        this.numeroComprador = numeroComprador;
        this.nombreComprador = nombreComprador;
        this.apellidoComprador = apellidoComprador;
        this.numeroDNI = numeroDNI;
        this.emaemail =email;
        this.calle = calle;
        this.numnumeroCalle =numeroCalle;
        this.localidad = localidad;
        this.provincia = provincia;
    }

    static async insert(transaction, numeroComprador, nombreComprador, apellidoComprador, numeroDNI, email, calle, numeroCalle, localidad, provincia){
        // const pool = await connectToDatabase();
        await transaction.request()
            .input('numeroComprador', sql.Int, numeroComprador)
            .input('nombreComprador', sql.VarChar, nombreComprador)
            .input('apellidoComprador', sql.VarChar, apellidoComprador)
            .input('numeroDNI', sql.Decimal, numeroDNI)
            .input('email', sql.VarChar, email)
            .input('calle', sql.VarChar, calle)
            .input('numeroCalle', sql.Decimal, numeroCalle)
            .input('localidad', sql.VarChar, localidad)
            .input('provincia', sql.VarChar, provincia)
            .query('INSERT INTO COMPRADOR (NUMERO_COMPRADOR,NOMBRE_COMPRADOR,APELLIDO_COMPRADOR,NUMERO_DNI,EMAIL,CALLE,NUMERO_CALLE,LOCALIDAD,PROVINCIA) VALUES(@numeroComprador, @nombreComprador,@apellidoComprador,@numeroDNI,@email,@calle,@numeroCalle,@localidad,@provincia)');
        // await pool.close();
        return true;
    }

    static async maxID(transaction) {
        try {
            // const pool = await connectToDatabase();
            const result = await transaction.request()
                .query('SELECT ISNULL(MAX(NUMERO_COMPRADOR),0) + 1 as proximoNumero FROM COMPRADOR');
                return result.recordset[0].proximoNumero;
        } catch (error) {
            console.error('Error al obtener articulos:', error);
            // res.status(500).send('Error al obtener usuarios');
        }
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

export default Comprador;