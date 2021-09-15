//DEPENDENCY IMPORTS
const express  = require('express')
const {MongoClient} = require('mongodb')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const serverApp = express();
const bodyParser = require("body-parser");
require("dotenv").config();


//MIDDLE WARE CONFIGS
serverApp.use(bodyParser.json());
serverApp.use(bodyParser.urlencoded({ extended: false }));
serverApp.set('view enginer', 'ejs')
serverApp.use(express.static('public'))

//\\-----ROUTES------//\\

//MONGO CONNECT
const connectionString ='mongodb+srv://user1:gokul1234@cluster0.s8vlm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
MongoClient.connect(connectionString, (err,client) => {
    //ERROR HANDLING
    if(err){
        return console.error(err)
    }
    //RETRIEVE THE DB
    const todolistDB = client.db('todolist-database')
    const tasksCollection = todolistDB.collection('tasks');
    console.log('retrieved the database');

        //GET
    serverApp.get('/', (req, res) => {
        todolistDB.collection('tasks').find({}).toArray()
        .then( tasks=>{res.render('index.ejs', {tasks : tasks})
         })
         .catch(err =>console.error(err));
    })

   

   


    
// Register user API
serverApp.post("/register", async (req, res) => {
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
     
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await todolistDB.collection('users').insertOne({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
 
      // return new user
      res.status(200).json({token});
    } catch (err) {
      console.log('there is some issue');
    }

  });


});


serverApp.listen(8000, ()=>{
    console.log('listening 8000')
});

module.exports = serverApp;