class ArticuloAccesorios{
    constructor(codigoArticulo, codigoAccesorio){
        this.codigoArticulo = codigoArticulo;
        this.codigoAccesorio = codigoAccesorio;
    }
    
    static async findByIds(connection, codigoArticulo, codigoAccesorio){
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_ARTICULO_FK as codigoArticulo, CODIGO_ACCESORIO_FK as codigoAccesorio FROM ARTICULO_ACCESORIOS WHERE CODIGO_ARTICULO_FK = ? AND CODIGO_ACCESORIO_FK = ?', [codigoArticulo, codigoAccesorio]);
            const articuloAccesorios = resultsDB[0];
            let result;
            if (articuloAccesorios)
                result = new ArticuloAccesorios(articuloAccesorios.codigoArticulo, articuloAccesorios.codigoAccesorio);
            return result;
        } catch (error) {
            throw new Error('Error al obtener accesorio de artículo')
        }
    }

    static async findByIdArt(connection, codigoArticulo){
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_ARTICULO_FK as codigoArticulo, CODIGO_ACCESORIO_FK as codigoAccesorio FROM ARTICULO_ACCESORIOS WHERE CODIGO_ARTICULO_FK = ?', [codigoArticulo]);
            const articuloAccesorios = resultsDB[0];
            let result;
            if (articulo)
                result = new ArticuloAccesorios(articuloAccesorios.codigoArticulo, articuloAccesorios.codigoAccesorio);
            return result;
        } catch (error) {
            throw new Error('Error al obtener accesorios de artículo')
        }
    }

    static async getAll(connection) {
        try {
            const [resultsDB] = await connection.query('SELECT CODIGO_ARTICULO_FK as codigoArticulo, CODIGO_ACCESORIO_FK as codigoAccesorio FROM ARTICULO_ACCESORIOS');
            const results = resultsDB.map(articuloAccesorios => new ArticuloAccesorios(
                articuloAccesorios.codigoArticulo,
                articuloAccesorios.codigoAccesorio
            ));
            return results;
        } catch (error) {
            throw new Error('Error al obtener accesorios de artículos')
        }
    }

    static async insert(connection, codigoArticulo, codigoAccesorio) {
        try {
            const result = await connection.execute('INSERT INTO ARTICULO_ACCESORIOS (CODIGO_ARTICULO_FK, CODIGO_ACCESORIO_FK) VALUES(?,?)', [codigoArticulo, codigoAccesorio]);
            return result;
        } catch (error) {
            throw new Error('Error al grabar accesorio de artículo')
        }
    }

    static async deleteByIdArt(connection, codigoArticulo) {
        try {
            const result = await connection.query('DELETE FROM ARTICULO_ACCESORIOS WHERE CODIGO_ARTICULO_FK = ?', [codigoArticulo]);
            return result;
        } catch (error) {
            throw new Error('Error al eliminar accesorios de artículo')
        }
    }

    static async existAccesorie(connection, codigoArticulo, codigoAccesorio){
        try {
            let [returnDB] = await connection.query('SELECT (CASE WHEN EXISTS (SELECT 1 FROM ARTICULO_ACCESORIOS WHERE CODIGO_ARTICULO_FK = ? AND CODIGO_ACCESORIO_FK = ?) THEN 1 ELSE 0 END) as existeAccesorioArticulo', [codigoArticulo, codigoAccesorio]);
            return returnDB[0].existeAccesorioArticulo;
        } catch (error) {
            throw new Error('Error al obtener existencia de accesorio de artículo')
        }
    }

    static async existReferencesByCodAccesorie(connection, codigoAccesorio){
        try {
            let [returnDB] = await connection.query('SELECT (CASE WHEN EXISTS (SELECT 1 FROM ARTICULO_ACCESORIOS WHERE CODIGO_ACCESORIO_FK = ?) THEN 1 ELSE 0 END) as existeReferenciaArticulo', [codigoAccesorio]);
            return returnDB[0].existeReferenciaArticulo;
        } catch (error) {
            throw new Error('Error al obtener existencia de accesorio de artículo')
        }
    }

    static async existReferencesByCodArtUtilizables(connection, codigoArticulo){
        try {
            let [returnDB] = await connection.query('SELECT (CASE WHEN EXISTS (SELECT 1 FROM ARTICULO_ACCESORIOS LEFT JOIN ACCESORIOS on CODIGO_ACCESORIO_FK = CODIGO_ACCESORIO WHERE CODIGO_ARTICULO_FK = ? and UTILIZABLE = 1) THEN 1 ELSE 0 END) as existeAccesorioArticulo', [codigoArticulo]);
            return returnDB[0].existeAccesorioArticulo;
        } catch (error) {
            throw new Error('Error al obtener existencia de accesorio de artículo')
        }
    }
}

export default ArticuloAccesorios;