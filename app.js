const express = require("express");
const port = process.env.PORT || 3000;
const urlencodedParser = express.urlencoded({ extended: true });
//require("dotenv").config();
const mysql = require('mysql')

//const nodemailer = require("nodemailer");

//const url="mongodb://localhost:27017"
//Create Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  // database: 'addressapp'

})

//Connect to MySQL
db.connect(err => {
  if (err) {
    throw err
  }
  console.log('MySQL Connected')
})


const app = express();

//Create Database
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE addressapp";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Database created");
  })
})

app.get("/regtable", (req, res) => {
  let sql = 'CREATE TABLE reguser(id int AUTO_INCREMENT, fname VARCHAR(30), lname VARCHAR(30), email VARCHAR(50), regpassword VARCHAR(30), passwordConfirmation VARCHAR(30), zipcode VARCHAR(7), PRIMARY KEY(id))'
  db.query(sql, (err) => {
    if (err) {
      throw err
    }
    res.send("User table created")
  })
})

app.get("/addresstable", (req, res)=>{
  let sql='CREATE TABLE user(id int AUTO_INCREMENT, email VARCHAR(50), street_number VARCHAR(30), street_name VARCHAR(50), city VARCHAR(30), province VARCHAR(30), postcode VARCHAR(10), country VARCHAR(30), PRIMARY KEY(id))'
  db.query(sql, (err)=>{
    if(err){
      throw err
    }
    res.send("Address table created")
  })
})

app.get("/contacttable", (req, res)=>{
  let sql='CREATE TABLE user(id int AUTO_INCREMENT, name VARCHAR(30), email VARCHAR(50), phone VARCHAR(10), message TEXT(300), PRIMARY KEY(id))'
  db.query(sql, (err)=>{
    if(err){
      throw err
    }
    res.send("Contact table created")
  })
})

app.use(express.static("public"))
app.use(express.json())
app.use(urlencodedParser)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index1.html');//Route handler

});
// app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/public/index1.html');//Route handler

// });



app.post('/register', urlencodedParser, async (req, res) => {


  try {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let regpassword = req.body.regpassword;
    let passwordConfirmation = req.body.passwordConfirmation;
    let zipcode = req.body.zipcode


    if (fname && lname && email && regpassword && passwordConfirmation && zipcode) {

      
      let post = { fname: fname, lname: lname, email: email, regpassword: regpassword, passwordConfirmation: passwordConfirmation, zipcode: zipcode }
      // console log
      let findUser = 'SELECT * FROM reguser WHERE email=?'
      db.query(findUser, email, (err,data) => {
        // if (err) throw err
        if(data.length>0) {
          
        //console.log(data.length)
      
          return res.status(400).send("User already exists")
        } else {
          let sql = 'INSERT INTO reguser SET ?'
          db.query(sql, post, (err) => {
            if (err) {
              throw err
            }
            return res.status(200).send("success")
          })
        }
      })


      
    } else {
      res.status(400).send("bad request");

    }

  } catch (ex) {
    return res.status(500).send("error");
  }
});

app.post ('/contact', urlencodedParser, (req, res)=>{
  
  try{
    //console.log(req.body);
    let name=req.body.yourName;
    let email=req.body.yourEmail;
    let phone=req.body.phoneNumber;
    let message=req.body.message
    if(name && email && phone && message){
     let post={name:name, email:email, phone:phone, message:message}
     let sql='INSERT INTO user SET ?'
     db.query(sql, post, (err)=>{
       if(err){
         throw err
       }
       return res.status(200).send('success')
     })
     
    }else{
      return res.status(400).send("bad request");

    }
  }catch(ex){
    return res.status(500).send("error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})


