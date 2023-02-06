const config = {
    db: {
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    listPerPage: 10,
  };
  module.exports = config;