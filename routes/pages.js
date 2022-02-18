const express = require("express");
const router = express.Router();

//Create Database
router.get("/createdb", (req, res) => {
    let sql = "CREATE DATABASE addressapp";
    db.query(sql, (err) => {
      if (err) {
        throw err;
      }
      res.send("Database created");
    })
  })
 


module.exports = router;