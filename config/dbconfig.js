import dotenv from "dotenv";
dotenv.config();

const config = {
  host: process.env.database_host,
  user: process.env.database_user,
  password: process.env.database_password,
  database: process.env.database_database,
};

export default config;
