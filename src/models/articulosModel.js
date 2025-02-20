import {sql} from '../database/sqlserver.js';

class Articulo{
    constructor(codigo, nombre, codigoMarca, precio, precioUSD, utilizable){
        this.codigo = codigo;
        this.nombre = nombre;
        this.codigoMarca = codigoMarca;
        this.precio = precio;
        this.precioUSD = precioUSD;
        this.utilizable = utilizable;
    }
    
    static async findById(connection, codigo){
        try {
            const formato = new Intl.NumberFormat('es-AR', {
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            });
            const [resultsDB] = await connection.query('SELECT CODIGO_ARTICULO as codigo, NOMBRE_ARTICULO as nombre, CODIGO_MARCA_FK as codigoMarca, PRECIO as precio, PRECIO_USD as precioUSD, UTILIZABLE as utilizable  FROM ARTICULOS WHERE CODIGO_ARTICULO = ?', [codigo]);
            const articulo = resultsDB[0];
            let result;
            if (articulo)
              result = new Articulo(articulo.codigo, articulo.nombre, articulo.codigoMarca, formato.format(articulo.precio), formato.format(articulo.precioUSD, articulo.utilizable === 1));
            return result;
        } catch (error) {
            throw new Error('Error al obtener artículo')
        }
    }

    static async getAll(connection) {
        try {
            const formato = new Intl.NumberFormat('es-AR', {
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            });
            const [resultsDB] = await connection.query('SELECT CODIGO_ARTICULO as codigo, NOMBRE_ARTICULO as nombre, CODIGO_MARCA_FK as codigoMarca, PRECIO as precio, PRECIO_USD as precioUSD, UTILIZABLE as utilizable FROM ARTICULOS');
            const results = resultsDB.map(art => new Articulo(
                art.codigo,
                art.nombre,
                art.codigoMarca,
                formato.format(art.precio),
                formato.format(art.precioUSD),
                art.utilizable === 1
            ));
            return results;
        } catch (error) {
            throw new Error('Error al obtener artículos')
        }
    }

    static async insert(connection, codigo, nombre, precio, precioUSD, codigoMarca, utilizable) {
        try {
            const result = await connection.execute('INSERT INTO ARTICULOS (CODIGO_ARTICULO, NOMBRE_ARTICULO, CODIGO_MARCA_FK, PRECIO, PRECIO_USD, UTILIZABLE) VALUES(?,?,?,?,?,?)', [codigo, nombre, codigoMarca, precio, precioUSD, utilizable]);
            return result;
        } catch (error) {
            throw new Error('Error al grabar artículo')
        }
    }

    static async delete(connection, codigo) {
        try {
            const result = await connection.query('DELETE FROM ARTICULOS WHERE CODIGO_ARTICULO = ?', [codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al eliminar artículos')
        }
    }

    static async update(connection, codigo, nombre, precio, precioUSD, utilizable) {
        try {
            const result = await connection.execute('UPDATE ARTICULOS SET NOMBRE_ARTICULO = ?, PRECIO = ?, PRECIO_USD = ?, UTILIZABLE = ? WHERE CODIGO_ARTICULO = ?', [nombre, precio, precioUSD, utilizable, codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al actualizar artículo')
        }
    }
}

export default Articulo;