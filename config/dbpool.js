import mysql from "mysql2";
import dbconfig from "./dbconfig.js";

const pool = mysql.createPool(dbconfig);

export default pool.promise();
