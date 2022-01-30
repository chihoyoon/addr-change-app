const express=require("express");
const port=process.env.PORT || 3000;
const urlencodedParser = express.urlencoded({ extended: true });
const mysql=require("mysql")
//Create Connection
 const db=mysql.createConnection({
   host : 'localhost',
   user:'root',
   password:'',
   database:'addressapp'
  
 })
//Connect to MySQL
 db.connect (err=>{
   if(err){
     throw err
   }
   console.log('MySQL Connected')
 })
const app=express();

//  //Create Database
  app.get ("/createdb", (req, res)=>{
    let sql = "CREATE DATABASE addressapp";
    db.query(sql, (err)=>{
      if(err){
        throw err;
      }
      res.send("Database created");
    })
  })

  app.get("/contact", (req, res)=>{
    let sql='CREATE TABLE user(id int AUTO_INCREMENT, name VARCHAR(30), email VARCHAR(50), phone VARCHAR(10), message TEXT(300), PRIMARY KEY(id))'
    db.query(sql, (err)=>{
      if(err){
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


 app.get('/', (req,res)=>{
     res.sendFile(__dirname +'/public/contact.html');
   });


   app.post ('/', urlencodedParser, (req, res)=>{
  
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
  

  app.listen (port, ()=>{
      console.log(`Server listening on ${port}`)
  })

// //Inser data
// app.get('/addpost1', (req, res)=>{
//   let post={name:'asd', email:'asd@test.com', phone:'123456',message:'Hi'}
//   let sql='INSERT INTO user SET ?'
//   let query=db.query(sql, post, (err)=>{
//     if(err){
//       throw err
//     }
//     res.send('One post created')
//   })
// })
// db.connect(function(err) {
        //   if (err) throw err;
        //   console.log("Connected!");
        //   let sql = "INSERT INTO users (id int AUTO_INCREMENT, name VARCHAR(30), email VARCHAR(50), phone VARCHAR(10), message TEXT(300), PRIMARY KEY(id)) VALUES ?";
        //   let values = {name , email, phone, message };
        //   db.query(sql, values, function (err, result) {
        //     if (err) throw err;
        //     console.log("Number of records inserted: ");
        //   });
        // });
        // let database = "CREATE DATABASE addressapp";
        // let table='CREATE TABLE user(id int AUTO_INCREMENT, name VARCHAR(30), email VARCHAR(50), phone VARCHAR(10), message TEXT(300), PRIMARY KEY(id))'
       
        // let doc={yourname:name , yourEmail:email, mobile:phone, message:message }
        // let insertion='INSERT INTO user SET ?'
        // db.query(database, table, doc, insertion, (err)=>{
        //   if(err){
        //     throw err
        //   }
        //   res.send("User table created")
        // })
        
        //  MongoClient.connect(url, { useUnifiedTopology: true }, (err, client)=> {
        //    const db=client.db("contact")
        //    const collection =db.collection("contactusers")
        //    const doc={yourname:name , yourEmail:email, mobile:phone, message:message };
        //    collection.insertOne(doc, (error,result) =>{
        //      if(!error){
        //        client.close();
        //        //console.log(result.ops)
        //        res.send (doc)
    
        //      }else{
        //        client.close();
        //        res.send("is an error")
        //      }
            
        //    });
        //  });
  

  // CREATE TABLE `contacts` (
  //   `id` int(11) NOT NULL,
  //   `f_name` varchar(100) NOT NULL,
  //   `l_name` varchar(100) NOT NULL,
  //   `email` varchar(100) NOT NULL,
  //   `message` text NOT NULL,
  //   `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  // ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  
  
  
  
  
  // var sql = `INSERT INTO contacts (f_name, l_name, email, message, created_at) VALUES ("${f_name}", "${l_name}", "${email}", "${message}", NOW())`;
  //   db.query(sql, function(err, result) {
  //     if (err) throw err;
  //     console.log('record inserted');
  //     req.flash('success', 'Data added successfully!');
  //     res.redirect('/');
  //   });