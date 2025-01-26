import {connectToDatabase, sql} from '../database/sqlserver.js';

class Articulo{
    constructor(codigo, nombre, codigoMarca, precio, precioUSD){
        this.codigo = codigo;
        this.nombre = nombre;
        this.codigoMarca = codigoMarca;
        this.precio = precio;
        this.precioUSD = precioUSD;
    }

    static async findById(id){
        const pool = await connectToDatabase();
        const resultsBD = await pool.request()
            .input('id', sql.VarChar, id)
            .query('SELECT CODIGO_ARTICULO as codigo, NOMBRE_ARTICULO as nombre, CODIGO_MARCA_FK as codigoMarca, PRECIO as precio, PRECIO_USD as precioUSD FROM ARTICULOS WHERE CODIGO_ARTICULO = @id');
        const articulo = resultsBD.recordset[0];
        const results = new Articulo(articulo.codigo, articulo.nombre, articulo.codigoMarca, articulo.precio, articulo.precioUSD);
            await pool.close();
            return results;
    }

    static async getAll(transaction) {
        try {
            const formato = new Intl.NumberFormat('es-AR', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              });
            const resultsBD = await transaction.request()
                .query('SELECT CODIGO_ARTICULO as codigo, NOMBRE_ARTICULO as nombre, CODIGO_MARCA_FK as codigoMarca, PRECIO as precio, PRECIO_USD as precioUSD FROM ARTICULOS');
            const results = resultsBD.recordset.map(art => new Articulo(
                art.codigo,
                art.nombre,
                art.codigoMarca,
                formato.format(art.precio),
                formato.format(art.precioUSD)
            ));
            // await pool.close();
            return results;
        } catch (error) {
            console.error('Error al obtener articulos:', error);
            // res.status(500).send('Error al obtener usuarios');
        }
    }

    static async insert(req, res) {
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('id', sql.VarChar, id)
                .input('codigo', sql.VarChar, id)
                .input('codigoMarca', sql.VarChar, id)
                .input('precio', sql.Decimal, id)
                .input('precioUSD', sql.Decimal, id)
                .query('INSERT INTO ARTICULOS (CODIGO_ARTICULO, NOMBRE_ARTICULO, CODIGO_MARCA_FK, PRECIO, PRECIO_USD) VALUES(@id, @nombre,@codigoMarca, @precio,@precioUSD)');
            await pool.close();
            return result;
        } catch (error) {
            console.error('Error al obtener articulos:', error);
            res.status(500).send('Error al obtener usuarios');
        }
    }

    static async delete(req, res) {
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('id', sql.VarChar, id)
                .query('DELETE FROM ARTICULOS WHERE CODIGO_ARTICULO = @id');
            await pool.close();
            return result;
        } catch (error) {
            console.error('Error al obtener articulos:', error);
            res.status(500).send('Error al obtener usuarios');
        }
    }
}

export default Articulo;