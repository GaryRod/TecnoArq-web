// import {connectToDatabase, sql}  from "../database/sqlserver.js";
import {connectToDatabase, mysql}  from "../database/mysql.js";
/**
 * @param {Function} transactionCallback - Función que contiene las operaciones a ejecutar dentro de la transacción.
 * @returns {Promise<any>} - El resultado de la operación si tiene éxito.
 */
// const executeTransaction = async (transactionCallback) => {
//   const pool = await connectToDatabase();
//   const transaction = new sql.Transaction(pool);
//   try {
//     await transaction.begin();
//     const result = await transactionCallback(transaction);
//     await transaction.commit();
//     return result;
//   } catch (error) {
//     await transaction.rollback();
//     throw new Error(error.message)
//   } finally {
//     pool.close();
//   }
// };

const executeTransaction = async (transactionCallback) => {
  const connection = await connectToDatabase();
  try {
    await connection.beginTransaction();
    const result = await transactionCallback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw new Error(error.message)
  } finally {
    connection.end();
  }
};

export default executeTransaction;