class Accesorio{
    constructor(codigo, nombre, utilizable){
        this.codigo = codigo;
        this.nombre = nombre;
        this.utilizable = utilizable;
    }
    
    static async findById(connection, codigo){
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_ACCESORIO as codigo, NOMBRE_ACCESORIO as nombre, UTILIZABLE as utilizable FROM ACCESORIOS WHERE CODIGO_ACCESORIO = ?', [codigo]);
            const accesorio = resultsDB[0];
            let result;
            if (accesorio)
                result = new Accesorio(accesorio.codigo, accesorio.nombre, accesorio.utilizable === 1);
            return result;
        } catch (error) {
            throw new Error('Error al obtener accesorio ')
        }
    }

    static async getAll(connection) {
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_ACCESORIO as codigo, NOMBRE_ACCESORIO as nombre, UTILIZABLE as utilizable FROM ACCESORIOS');
            const results = resultsDB.map(accesorio => new Accesorio(
                accesorio.codigo,
                accesorio.nombre,
                accesorio.utilizable === 1
            ));
            return results;
        } catch (error) {
            throw new Error('Error al obtener accesorios')
        }
    }

    static async insert(connection, codigo, nombre, utilizable) {
        try {
            const result = await connection.execute('INSERT INTO ACCESORIOS (CODIGO_ACCESORIO, NOMBRE_ACCESORIO, UTILIZABLE) VALUES(?,?,?)', [codigo, nombre,utilizable]);
            return result;
        } catch (error) {
            throw new Error('Error al grabar accesorio')
        }
    }

    static async delete(connection, codigo) {
        try {
            const result = await connection.query('DELETE FROM ACCESORIOS WHERE CODIGO_ACCESORIO = ?', [codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al eliminar accesorios')
        }
    }

    static async update(connection, codigo, nombre, utilizable) {
        try {
            const result = await connection.execute('UPDATE ACCESORIOS SET NOMBRE_ACCESORIO = ?, UTILIZABLE = ? WHERE CODIGO_ACCESORIO = ?', [nombre, utilizable, codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al actualizar accesorio')
        }
    }

    static async existReferences(connection, codigo, nombre, utilizable) {
        try {
            const result = await connection.execute('UPDATE ACCESORIOS SET NOMBRE_ACCESORIO = ?, UTILIZABLE = ? WHERE CODIGO_ACCESORIO = ?', [nombre, utilizable, codigo]);
            return result;
        } catch (error) {
            throw new Error('Error al actualizar accesorio')
        }
    }
}

export default Accesorio;