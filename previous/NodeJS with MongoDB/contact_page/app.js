const express=require("express");
const port=process.env.PORT || 3000;
const urlencodedParser = express.urlencoded({ extended: true });
const MongoClient = require("mongodb").MongoClient;

const url="mongodb://localhost:27017"
const app=express();


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
       
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client)=> {
          const db=client.db("contact")
          const collection =db.collection("contactusers")
          const doc={yourname:name , yourEmail:email, mobile:phone, message:message };
          collection.insertOne(doc, (error,result) =>{
            if(!error){
              client.close();
              //console.log(result.ops)
              res.send (doc)
    
            }else{
              client.close();
              res.send("is an error")
            }
            
          });
        });
  
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