const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProduction =
  process.env.NODE_ENV === "production" || process.env.RENDER;
const databaseUrl = process.env.DATABASE_URL?.trim().replace(
  /^['"`]|['"`]$/g,
  "",
);

const connectionOptions = {
  dialect: process.env.DB_DIALECT || "postgres",
  dialectOptions: isProduction
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  logging: false,
};

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, connectionOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...connectionOptions,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
      },
    );

module.exports = sequelize;
