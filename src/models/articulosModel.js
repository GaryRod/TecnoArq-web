const {connectToDatabase, sql} = require('../database/sqlserver');

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

    static async getAll(req, res) {
        try {
            const pool = await connectToDatabase();
            const resultsBD = await pool.request()
                .query('SELECT CODIGO_ARTICULO as codigo, NOMBRE_ARTICULO as nombre, CODIGO_MARCA_FK as codigoMarca, PRECIO as precio, PRECIO_USD as precioUSD FROM ARTICULOS'); // Cambia 'Users' por tu tabla
            const results = resultsBD.recordset.map(art => new Articulo(
                art.codigo,
                art.nombre,
                art.codigoMarca,
                art.precio,
                art.precioUSD
            ));
            await pool.close();
            return results;
        } catch (error) {
            console.error('Error al obtener articulos:', error);
            res.status(500).send('Error al obtener usuarios');
        }
    }
}

module.exports = Articulo;