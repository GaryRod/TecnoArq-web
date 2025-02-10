import {connectToDatabase, sql} from '../database/sqlserver.js';

class Marca{
    constructor(codigo, nombre, utilizable){
        this.codigo = codigo;
        this.nombre = nombre;
        this.utilizable = utilizable;
    }

    static async findById(connection, codigo){
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_MARCA as codigo, NOMBRE_MARCA as nombre, UTILIZABLE as utilizable FROM MARCAS WHERE CODIGO_MARCA = ?', [codigo]);
            const result = resultsDB[0];
            if (result) {
                results = new Marca(result.codigo, result.nombre, result.utilizable);
            }
            return result;
        } catch (error) {
            throw new Error('Error al obtener marca')
        }
    }

    static async getAll(connection) {
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_MARCA as codigo, NOMBRE_MARCA as nombre, UTILIZABLE as utilizable  FROM MARCAS');
            const results = resultsDB.map(marca => new Marca(
                marca.codigo,
                marca.nombre,
                marca.utilizable === 1
            ));
            return results;
        } catch (error) {
            throw new Error('Error al obtener marcas')
        }
    }

    static async insert(connection, codigo, nombre, utilizable) {
        try {
            const [result]= await connection.execute('INSERT INTO MARCAS (CODIGO_MARCA, NOMBRE_MARCA, UTILIZABLE) VALUES (?,?, ?)', [codigo, nombre, utilizable]);
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
}

export default Marca;