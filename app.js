const express = require("express");
const path = require('path');
const port = process.env.PORT || 3000;

const urlencodedParser = express.urlencoded({ extended: true });
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});
const bcrypt = require("bcrypt");
const { resolve } = require("path");
const { reject } = require("bcrypt/promises");

//add JWT

const jwt = require("jsonwebtoken");


const app = express();

//const nodemailer = require("nodemailer");
//const url="mongodb://localhost:27017"



// 1.Create Connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  //database: 'addressapp' change to:
  database: process.env.DATABASE
  
});

// 2.Connect to MySQL
db.connect(err => {
  if (err) {
    throw err
  }
  console.log('MySQL Connected')
})


const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.set('view engine');



//Define Routes
app.use('/', require('./routes/pages'));
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


app.get("/regtable", (req, res) => {
  let sql = 'CREATE TABLE reguser(id int AUTO_INCREMENT, fname VARCHAR(30), lname VARCHAR(30), email VARCHAR(50), regpassword VARCHAR(255), passwordConfirmation VARCHAR(30), zipcode VARCHAR(7), PRIMARY KEY(id))'
  db.query(sql, (err) => {
    if (err) {
      throw err
    }
    res.send("User table created")
  })
})

// Create address table
app.get("/addresstable", (req, res)=>{
  let sql='CREATE TABLE address(id int AUTO_INCREMENT, street_number VARCHAR(30), street_name VARCHAR(50), city VARCHAR(30), province VARCHAR(30), zipcode VARCHAR(10), country VARCHAR(30), old_street_number VARCHAR(30), old_street_name VARCHAR(50), old_city VARCHAR(30), old_province VARCHAR(30), old_zipcode VARCHAR(10), old_country VARCHAR(30), startdate DATE, company VARCHAR(30), PRIMARY KEY(id))'
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


app.get('/', (req, res) => {
  res.render('index');//Route handler

});


app.post('/register', //urlencodedParser,//
 async (req, res) => {


  try {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let regpassword = req.body.regpassword;
    let passwordConfirmation = req.body.passwordConfirmation;
    let zipcode = req.body.zipcode
    //adding salt
    const saltRounds = 10;
    
    console.log(regpassword)
    const hashedPassword = await new Promise((resolve, reject)=>{
    bcrypt.hash(regpassword, saltRounds, function(err, hash){
      if (err) reject(err)
      resolve(hash)});
    });
    console.log(hashedPassword);
    
  
    if (fname && lname && email && regpassword && passwordConfirmation && zipcode) {

      
      let post = { fname: fname, lname: lname, email: email, regpassword: hashedPassword, passwordConfirmation: passwordConfirmation, zipcode: zipcode }
      // console log
      let findUser = 'SELECT * FROM reguser WHERE email=?'
      db.query(findUser, email, (err,data) => {
        if (err) throw err
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
    } 
    else {
      res.status(400).send("bad request");

    }

  } catch (ex) {
    console.log(ex)
    return res.status(500).send("error");
  }
});


//Login page (authentification)
 
app.post('/Login', urlencodedParser, async (req, res) => {
  try{
    const{email, password1} = req.body;
    
    if (!email || !password1){
      return res.status (400).send('Please provide email and password')
      
    }
    const sqlSearch = "Select * from reguser where email = ?"
    const search_query = mysql.format(sqlSearch,[email])
    console.log(search_query);
 
    
    await db.query (search_query, async (err, result) => {

        if (err) throw (err)
        //next 
        if (result.length == 0){
          console.log('---> User does not exist')
          res.sendStatus(404)
        }
        else {
          //adding
          console.log(result)
          const hashedPassword = result[0].regpassword
          const userFirstName = result[0].fname
          const userLastName = result[0].lname
          console.log(hashedPassword)          
          //hashedPasswordfrom result
          console.log(password1)
          if (await bcrypt.compare(password1, hashedPassword)){
            console.log(result);
            // res.send(`${email} is loged in now`)
            
            //add JWT//////////////////////////////////////////////////////////////////////////JWT code
            console.log("---------> Generating accessToken")
            const accessToken = generateAccessToken ({email: req.body.email})
            const refreshToken = generateRefreshToken ({email: req.body.email})
            console.log(accessToken)
            res.json ({accessToken: accessToken, refreshToken: refreshToken, userFirstName: userFirstName, userLastName: userLastName})
             // res.send(`${email} is loged in now`)           
          }
          else {
           
            console.log('Password incorrect')
         } //end of bcrypt.compare()

          
        }
      })

  } catch(error){
    res.status(401).send("Password Incorrect!")
    console.log(error);
  }
})

// accessTokens
function generateAccessToken(email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) 
}

// refreshTokens 
// TODO Next step is to store the refresh token to the Database
let refreshTokens = []

function generateRefreshToken(email) {
  const refreshToken = jwt.sign(email, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
  refreshTokens.push(refreshToken)
  return refreshToken
  }
 
   //REFRESH TOKEN API
  app.post("/refreshToken", (req, res) => {
  console.log(req.body.token)

  if (!refreshTokens.includes(req.body.token)){
      res.status(400).send("Refresh Token Invalid")
      return
  }
 //remove the old refreshToken from the refreshTokens list
  refreshTokens = refreshTokens.filter( (c) => c != req.body.token)

  //new token generation 
  //TODO (delite/change ({email: req.body.email}))
  const accessToken = generateAccessToken ({email: req.body.email})
  const refreshToken = generateRefreshToken ({email: req.body.email})

  //generate new accessToken and refreshTokens
  res.json ({accessToken: accessToken, refreshToken: refreshToken})
  }) 

  app.delete("/logout", (req,res)=>{
   refreshTokens = refreshTokens.filter( (c) => c != req.body.token)

  //remove old refreshToken from the refreshTokens list
   res.status(204).send("Logged out!")
  })
  
  //Validate token
  app.get("/posts", validateToken, (req, res)=>{
    console.log("Token is valid")
    //TODO change email to first name&last name
    console.log(req.email.email)
    res.send(`${req.email.email} successfully accessed post`)
    })          
    function validateToken(req, res, next) {
      //get token from request header
      const authHeader = req.headers["authorization"]
      const token = authHeader.split(" ")[1]
      
      //request header contains token "Bearer <token>", split the string and use the second value in the split array
      if (token == null) res.sendStatus(400).send("Token not present")
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
      if (err) { 
       res.status(403).send("Token invalid")
       }
       else {
       req.email = email
       next() //proceed to the next action in the calling function
       }
      }) //end of jwt.verify()
    } //end of function
    
    
    // Update page
    app.post('/update', urlencodedParser, async (req, res) => {

      try{
        let street_number = req.body.streetnumber;
        let street_name = req.body.streetname;
        let city = req.body.city;
        let province = req.body.province;
        let zipcode = req.body.zipcode;
        let country = req.body.country
        let old_street_number = req.body.old_streetnumber;
        let old_street_name = req.body.old_streetname;
        let old_city = req.body.old_city;
        let old_province = req.body.old_province;
        let old_zipcode = req.body.old_zipcode;
        let old_country = req.body.old_country;
        let startdate = req.body.startdate;
        let company = req.body.source;
    
        if(street_number && street_name && city && province && zipcode && country && old_street_number && old_street_name && old_city && old_province && old_zipcode && old_country && startdate && company){
        
          let post = {street_number:street_number, street_name:street_name, city:city, province:province, zipcode:zipcode, country:country, old_street_number:old_street_number, old_street_name:old_street_name, old_city:old_city, old_province:old_province, old_zipcode:old_zipcode, old_country:old_country, startdate:startdate, company:company}
    
          let sql='INSERT INTO address SET ?'         
  
          console.log(post);

          db.query(sql, post, (err)=>{
            if(err){
              throw err;
            }
            return res.status(200).send(`Succes, Your address is ${street_number} ${street_name} ${city} ${province} ${zipcode}`);
          })
          
         }else{
           return res.status(400).send("bad request");
     
         }
       }catch(ex){
         return res.status(500).send("error");
       }
         
    });
    
    
//Contact page
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

