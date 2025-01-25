import {connectToDatabase, sql}  from "../database/sqlserver.js";
/**
 * @param {Function} transactionCallback - Función que contiene las operaciones a ejecutar dentro de la transacción.
 * @returns {Promise<any>} - El resultado de la operación si tiene éxito.
 */
const executeTransaction = async (transactionCallback) => {
  const pool = await connectToDatabase();
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const result = await transactionCallback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    console.log(error);
  } finally {
    pool.close();
  }
};

export default executeTransaction;