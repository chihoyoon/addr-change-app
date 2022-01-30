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
  password: '',
  database: 'addressapp'

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
app.get("/register", (req, res) => {
  let sql = 'CREATE TABLE reguser(id int AUTO_INCREMENT, fname VARCHAR(30), lname VARCHAR(30), email VARCHAR(50), password VARCHAR(30), passwordConfirmation VARCHAR(30), zipcode VARCHAR(7), PRIMARY KEY(id))'
  db.query(sql, (err) => {
    if (err) {
      throw err
    }
    res.send("User table created")
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
  res.sendFile(__dirname + '/public/register.html');//Route handler

});




app.post('/', urlencodedParser, async (req, res) => {


  try {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;
    let passwordConfirmation = req.body.passwordConfirmation;
    let zipcode = req.body.zipcode


    if (fname && lname && email && password && passwordConfirmation && zipcode) {

      
      let post = { fname: fname, lname: lname, email: email, password: password, passwordConfirmation: passwordConfirmation, zipcode: zipcode }
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


      
    } else {
      res.status(400).send("bad request");

    }

  } catch (ex) {
    return res.status(500).send("error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})



// app.get("/gettable", (req, res)=>{
//   let post={fname:'asd', lname:'asd', email:'test@test.com', password:'asd', confirmpassword:'asd', zipcode:'d3s 4d2'}
//   let sql='INSERT INTO reguser SET ?';
//   let query=db.query(sql, post, (err)=>{
//     if(err){
//       throw err
//     }else{
//       res.send("post table created")
//     }
//   })
// })

      // let transporter=nodemailer.createTransport({
      //     service:'gmail',
      //     auth:{
      //         user:'****',
      //         pass:'***'
      //     }
      // });


      // let mailOptions={
      //     from:'*****',
      //     to:req.body.email,
      //     //https://www.google.com/settings/security/lesssecureapps  cc:'',
      //     //bcc:'',
      //     subject:'Testing',
      //     text:'it works'
      //     //attachment:[{filename:'', path:''}]
      // }


      // transporter.sendMail(mailOptions, (err, data)=>{
      //     if(err){
      //         console.log('Error Occurs')
      //     }else{
      //console.log('Email sent!!')


      //   if(findUser){
      //     return res.status(400).send('error')
      //   }else{

      //     db.query(sql,post, ()=>{
      //       return res.status(200).send('success')
      //     })

      // }


      //       MongoClient.connect(url, { useUnifiedTopology: true }, async (err, client)=> {
      //         const db=client.db("newregister")
      //         const collection =db.collection("newusers")
      //         const doc={fname:fname, lname:lname, email:email,  password:password, passwordConfirmation:passwordConfirmation, zipcode:zipcode, created_date:Date()};
      //       const findUser= await collection.findOne({email:req.body.email})
      //      //console.log(findUser)
      //           if(findUser){
      //            // console.log("User already exists")
      //             return res.status(400).send({message:'User already exists!!'})



      //           }
      //           else{
      //             const newUser=await collection.insertOne(doc) 
      //                res.send (newUser)





      //           }

      //        })


      //  // }

      //})