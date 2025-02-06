const express = require("express");
const cors = require("cors")
const pool = require("./db");
const { use } = require("react");
const { unauthorized, forbidden } = require("next/navigation");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Routes

app.get("/",(req,res)=>{
    res.send("server is running.");
})

// USERS DATABASE: 

// Add user
// example: POST: http://localhost:5001/users
app.post("/users",async(req,res)=>{
    try
    {
      const { name,email,password }=req.body;

      const duplicateEmailExists = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
      if(duplicateEmailExists.rows.length>0)
      {
        return res.status(400).json({ error: "Error: Email already exists" }); 
      }

      const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [name, email, password]
      );
      res.json(newUser.rows[0]);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error: adding a user");
    }
})

// --------------------------------- Data retreive ---------------------------------

// Get all users
// GET: http://localhost:5001/users
app.get("/users",async(req,res)=>{
    try
    {
      const allUsers = await pool.query("SELECT * FROM users" );
      res.json(allUsers.rows);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error: getting all user");
    }
})

// Get a specific user with ID  (one result only bc user id is unique)

// example: 
// GET: http://localhost:5001/users/id/1
// The command above will pass 1 in the id parameter in the function below

app.get("/users/id/:id",async(req,res)=>{
    try
    {
      console.log("FETCHING USER WITH ID: ", req.params.id);    //DEBUGGIN STATEMENT

      const {id} = req.params; 
      const user = await pool.query("SELECT * FROM users WHERE id = $1;" , [id] );

      if(user.rows.length===0)
      {
        res.status(404).send("User not found with the ID provided");
      }
      res.json(user.rows[0]);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error: getting a user with id");
    }
})

// Get a specific user with email   (one result only bc user id is unique)

// example: 
// http://localhost:5001/users/email/alice@example.com
// The command above will pass alice@example.com in the email parameter in the function below

app.get("/users/email/:email",async(req,res)=>{
    try
    {
      console.log("FETCHING USER WITH EMAIL: ", req.params);
      const {email} = req.params; 
      const user = await pool.query("SELECT * FROM users WHERE email = $1;" , [email] );

      if(user.rows.length===0)
      {
        res.status(404).send("User not found with the email provided");
      }
      
      res.json(user.rows[0]);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error: getting a user with email");

    }
})

// Update password / Change password 
// PUT: http://localhost:5001/users/password/alice@example.com
// PROVIDE BODY of newPassword

app.put("/users/password/:email", async (req, res)=>{
    try{
        const{email}=req.params;
        console.log(`Updating password for user with email: ${email}`);
        const{newPassword}=req.body;

        const updateUser = await pool.query("UPDATE users SET password = $1 WHERE email = $2 RETURNING *;",[newPassword,email]);

        if(updateUser.rows.length===0)
      {
       return res.status(404).send("User not found with the email provided");
      }
       //Add another check to see if password field is empty
      res.json({message: "Successful: Password has been updated"});

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error: when trying to change password");
    }
});


app.listen(5001,()=>{
    console.log("server has started on port 5001");
});




//Self note:
// Error codes:
// 400 Bad requests (Client Error, Incorrect Input)
// 404 Not found (Fetch request does not exists in the database)
// 500 Server Internal Error

// 401 unauthorized
// 403 forbidden
// 409 Conflict