const config = {
    db: {
        // connectionLimit: 15,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        ssl: true
    },
    listPerPage: 10,
  };
  module.exports = config;