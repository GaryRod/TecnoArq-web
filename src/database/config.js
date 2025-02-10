import dotenv from 'dotenv';
dotenv.config();

// export default
// {
//     "conecctionString": {
//         "user": process.env.DB_USER,
//         "password": process.env.DB_PASSWORD,
//         "database": process.env.DB_DATABASE,
//         "server": process.env.DB_SERVER,
//         "options":{
//             "encrypt": process.env.DB_ENCRYPT === '1',
//             "trustServerCertification": process.env.DB_TRUST_SERVER_CERTIFICATION === '1',
//         }
//     }
// }

export default {
    "conecctionString": {
        "user": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_DATABASE,
        "host": process.env.DB_SERVER,
        "port": process.env.DB_PORT
    }
}