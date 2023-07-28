const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.POSTGRES_LIVE_URL, {
  dialect: "postgres",
  dialectOptions: {
    // Optional: You can set additional options for the PostgreSQL driver here
    ssl: {
      require: true, // Set to true if SSL is required
      rejectUnauthorized: false, // Set to false if you want to accept self-signed certificates
      // Other SSL options if necessary (e.g., ca, key, cert)
    },
  },
});

module.exports = sequelize;
