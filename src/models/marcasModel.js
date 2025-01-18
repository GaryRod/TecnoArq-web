const {connectToDatabase, sql} = require('../database/sqlserver');

class Marca{
    constructor(codigo, nombre){
        this.codigo = codigo;
        this.nombre = nombre;
    }

    static async findById(id){
        const pool = await connectToDatabase();
        const resultsBD = await pool.request()
            .input('id', sql.VarChar, id)
            .query('SELECT CODIGO_MARCA as codigo, NOMBRE_MARCA as nombre FROM MARCAS WHERE CODIGO_MARCA = @id');
        const  results = new Marca(resultsBD.recordset[0].codigo, resultsBD.recordset[0].nombre);
            await pool.close();
            return results;
    }

    static async getAll(req, res) {
        try {
            const pool = await connectToDatabase();
            const resultsBD = await pool.request().query('SELECT CODIGO_MARCA as codigo, NOMBRE_MARCA as nombre FROM MARCAS'); // Cambia 'Users' por tu tabla
            const results = resultsBD.recordset.map(art => new Marca(
                art.codigo,
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

module.exports = Marca;