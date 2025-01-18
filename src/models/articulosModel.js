const {connectToDatabase, sql} = require('../database/sqlserver');

class Articulo{
    constructor(codigo, nombre){
        this.codigo = codigo;
        this.nombre = nombre;
    }

    static async findById(id){
        const pool = await connectToDatabase();
        const resultsBD = await pool.request()
            .input('id', sql.VarChar, id)
            .query('SELECT CODIGO_ARTICULO as codigo, NOMBRE_ARTICULO as nombre FROM ARTICULOS WHERE CODIGO_ARTICULO = @id');
        const  results = new Articulo(resultsBD.recordset[0].codigo, resultsBD.recordset[0].nombre);
            await pool.close();
            return results;
    }

    static async getAll(req, res) {
        try {
            const pool = await connectToDatabase();
            const resultsBD = await pool.request().query('SELECT CODIGO_ARTICULO as codigo, NOMBRE_ARTICULO as nombre FROM ARTICULOS'); // Cambia 'Users' por tu tabla
            const results = resultsBD.recordset.map(art => new Articulo(
                art.codig,
                art.nombre
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