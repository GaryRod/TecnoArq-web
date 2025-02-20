import {connectToDatabase, sql} from '../database/sqlserver.js';

class Comprador{
    constructor(numeroComprador, nombreComprador, apellidoComprador, numeroDNI, email, calle, numeroCalle, localidad, provincia, numeroCelular, codigoPostal, datosAdicionales){
        this.numeroComprador = numeroComprador;
        this.nombreComprador = nombreComprador;
        this.apellidoComprador = apellidoComprador;
        this.numeroDNI = numeroDNI;
        this.emaemail =email;
        this.calle = calle;
        this.numnumeroCalle =numeroCalle;
        this.localidad = localidad;
        this.provincia = provincia;
        this.numeroCelular = numeroCelular;
        this.codigoPostal = codigoPostal;
        this.datosAdicionales = datosAdicionales;
    }

    static async insert(connection, numeroComprador, nombreComprador, apellidoComprador, numeroDNI, email, calle, numeroCalle, localidad, provincia, numeroCelular, codigoPostal, datosAdicionales){
        try {
            await connection.execute('INSERT INTO COMPRADOR (NUMERO_COMPRADOR,NOMBRE_COMPRADOR,APELLIDO_COMPRADOR,NUMERO_DNI,EMAIL,CALLE,NUMERO_CALLE,LOCALIDAD,PROVINCIA, NUMERO_CELULAR, CODIGO_POSTAL, DATOS_ADICIONALES) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
                [numeroComprador, nombreComprador, apellidoComprador, numeroDNI, email, calle, numeroCalle, localidad, provincia, numeroCelular,codigoPostal, datosAdicionales]
            );
            return true;
        } catch (error) {
            throw new Error('Error al insertar comprador')
        }
    }

    static async maxID(connection) {
        try {
            const [result] = await connection.query('SELECT IFNULL(MAX(NUMERO_COMPRADOR),0) + 1 as proximoNumero FROM COMPRADOR');
                return result[0].proximoNumero;
        } catch (error) {
            throw new Error('Error al obtener último ID de comprador')
        }
    }
}

export default Comprador;