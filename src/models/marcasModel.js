import {connectToDatabase, sql} from '../database/sqlserver.js';

class Marca{
    constructor(codigo, nombre, utilizable, imagen){
        this.codigo = codigo;
        this.nombre = nombre;
        this.utilizable = utilizable;
        this.imagen = imagen;
    }

    static async findById(connection, codigo){
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_MARCA as codigo, NOMBRE_MARCA as nombre, UTILIZABLE as utilizable, RUTA_IMAGEN as imagen FROM MARCAS WHERE CODIGO_MARCA = ?', [codigo]);
            let result = resultsDB[0];
            if (result) {
                result = new Marca(result.codigo, result.nombre, result.utilizable, result.imagen);
            }
            return result;
        } catch (error) {
            throw new Error('Error al obtener marca')
        }
    }

    static async getAll(connection) {
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_MARCA as codigo, NOMBRE_MARCA as nombre, UTILIZABLE as utilizable, RUTA_IMAGEN as imagen  FROM MARCAS');
            const results = resultsDB.map(marca => new Marca(
                marca.codigo,
                marca.nombre,
                marca.utilizable === 1,
                marca.imagen
            ));
            return results;
        } catch (error) {
            throw new Error('Error al obtener marcas')
        }
    }

    static async insert(connection, codigo, nombre, utilizable, imagen) {
        try {
            const [result]= await connection.execute('INSERT INTO MARCAS (CODIGO_MARCA, NOMBRE_MARCA, UTILIZABLE, RUTA_IMAGEN) VALUES (?,?,?,?)', [codigo, nombre, utilizable, imagen]);
            return result;
        } catch (error) {
            throw new Error('Error al insertar marca')
        }
    }

    static async update(connection, codigo, nombre, utilizable) {
        try {
            const [result]= await connection.execute('UPDATE MARCAS SET NOMBRE_MARCA = ?, UTILIZABLE = ? WHERE CODIGO_MARCA = ?', [nombre, utilizable, codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al actualizar marca')
        }
    }

    static async updateImg(connection, codigo, imagen) {
        try {
            const [result]= await connection.execute('UPDATE MARCAS SET RUTA_IMAGEN = ? WHERE CODIGO_MARCA = ?', [imagen, codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al actualizar imagen')
        }
    }

    static async findRutaImg(connection, codigo) {
        try {
            const [result]= await connection.execute('SELECT RUTA_IMAGEN as rutaImagen FROM MARCAS WHERE CODIGO_MARCA = ?', [ codigo]);
            return result[0].rutaImagen;
        } catch (error) {
            throw new Error('Error al obtener imagen')
        }
    }

    static async delete(connection, codigo) {
        try {
            const [result]= await connection.execute('DELETE FROM MARCAS WHERE CODIGO_MARCA = ?', [codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al eliminar marca')
        }
    }
}

export default Marca;