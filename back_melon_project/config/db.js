// db.js
const dotenv = require("dotenv").config();
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10, // จำนวน connection สูงสุดใน pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ ไม่สามารถเชื่อมต่อฐานข้อมูล:", err.message);
  } else {
    console.log("✅ เชื่อมต่อฐานข้อมูลสำเร็จ");
    connection.release(); // คืน connection กลับ pool
  }
});

module.exports = pool;
