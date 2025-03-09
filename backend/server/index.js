/*
SEE request.rest to see how the commands are used
*/

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
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
// POST: http://localhost:5001/users/add
// Provide JSON body with the following order: name, email, password
// Scroll all the way down for a sample JSON BODY 
app.post("/users/add",async(req,res)=>{
    try
    {
      const { name,email,password }=req.body;

      // Check for if there is duplicate emails in the database
      const duplicateEmailExists = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
      if(duplicateEmailExists.rows.length>0)
      {
        return res.status(400).json({ error: "Error: Email already exists" }); 
      }
      // Hashing Password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password,salt);

      const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [name, email, hashedPassword]
      );
      res.json(newUser.rows[0]);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error: adding a user");
    }
})


// Login: Get the user (For Login)
// GET: http://localhost:5001/users
app.get("/users", authenticateToken ,async(req,res)=>{
    try
    {
      const allUsers = await pool.query("SELECT * FROM users" );
      // console.log("Requesting User ID:", req.user.userID); //DEBUG
      const filteredUsers = allUsers.rows.filter(user => user.id === req.user.userID);
      // console.log("Filtered Users:", filteredUsers);   //DEBUG

      return res.json(filteredUsers);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error: getting all user");
    }
})

// GET all users
app.get("/users/getallusers",async(req,res)=>{
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
        return res.status(404).send("User not found with the ID provided");
      }
      res.json(user.rows[0]);
    }
    catch(err)
    {
        console.error(err.message); 
        return res.status(500).send("Server Error: getting a user with id");
    }
})

// Get a specific user with email   (one result only bc user id is unique)
// GET: http://localhost:5001/users/email/alice@example.com
// The command above will pass alice@example.com in the email parameter in the function below
app.get("/users/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Fetching user with email: '${email}'`); // ✅ Fixed Syntax

    // Query the database
    const user = await pool.query(
      "SELECT id, name, email, bio, profile_picture, rating, rides_taken, language, ride_preference FROM users WHERE email = $1;",
      [email.trim()] 
    );

    // Check if user exists
    if (user.rows.length === 0) {
      console.log("❌ User not found in database.");
      return res.status(404).json({ error: "User not found." });
    }

    console.log("User found:", user.rows[0]); 
    res.json(user.rows[0]); 
  } catch (err) {
    console.error("❌ Database Error:", err);
    res.status(500).json({ error: "Server Error: fetching user data." });
  }
});





// Update password / Change password 
// PUT: http://localhost:5001/users/password/alice@example.com
// PROVIDE JSON BODY of newPassword
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


// Delete a user
// DELETE: http://localhost:5001/users/delete/(id)
app.delete("/users/delete/:id",async(req,res)=>{

  try{
    const {id} = req.params;
    console.log("Deleting a user with ID: ", id);

    const deleteUser = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *;", [id]);

    if(deleteUser.rows.length===0)
      {
       return res.status(404).send("User not found with the id provided");
      }
    res.json({message: "Successful: User deleted",deleted_user: deleteUser.rows[0]});

  } catch(err)
  {
    console.error(err.message);
    res.status(500).send("Server Error: deleting a user");
  }
});app.put("/users/update/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10); // Convert ID to number
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { name, bio, language, ride_preference } = req.body;
    console.log(`Updating user with ID: ${userId}`, { name, bio, language, ride_preference });

    const updateUser = await pool.query(
      "UPDATE users SET name = $1, bio = $2, language = $3, ride_preference = $4 WHERE id = $5 RETURNING *",
      [name, bio, language, ride_preference, userId]
    );

    if (updateUser.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Updated user:", updateUser.rows[0]);
    res.json({ message: "Profile updated successfully", user: updateUser.rows[0] });
  } catch (err) {
    console.error("Server error updating profile:", err.message);
    res.status(500).send("Server error: updating user profile");
  }
});




// Login
// POST: http://localhost:5001/users/login
// PROVIDE JSON BODY for email and password
app.post("/users/login",async(req,res)=>{

  try{
    console.log("reached login route");
    const {email,password} = req.body;
    // Check if email exists in the database
    const userQ = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
    if(userQ.rows.length<1)
    {
      return res.status(400).json({error: "Email has not been registered."});
    }

    const user = userQ.rows[0];

    // Check if password is correct
    if(!await bcrypt.compare(password,user.password))
    {
      return res.status(400).json({error: "Incorrect email or password."});
    }

    // Login Success
    const accessToken = jwt.sign({userID: user.id, email: user.email}, process.env.ACCESS_TOKEN);
    return res.json({ message: "Login successful!", accessToken: accessToken, user:{id:user.id , name: user.name , email: user.email} });

  } catch(err)
  {
    res.status(500).json({error: "Server Error: User Login"});
  }
});



//Rides:

// Create a ride (Does not allow same user to create more than one ride)
// POST: http://localhost:5001/rides/create
// Provide JSON body with the following order: user_id , pickup_location , dropoff_location,cost
app.post("/rides/create",async(req,res)=>{

  try{
    const{user_id, pickup_location,dropoff_location,cost} = req.body;
    if(!user_id||!pickup_location||!dropoff_location||cost===null)  //cost===undefined?
    {
      return res.status(400).json({ error: "Error: Missing required field(s)." }); 
    }

    const existingRide = await pool.query("SELECT * FROM rides WHERE user_id = $1 AND status = 'pending';", [user_id]); //status = 'in progress'
    if(existingRide.rows.length>0)
      {
       return res.status(404).send("Cannot creata a new ride with an ongoing ride.");
      }
    const newRide = await pool.query("INSERT INTO rides (user_id, pickup_location, dropoff_location, cost) VALUES ($1,$2,$3,$4) RETURNING *;", [user_id, pickup_location, dropoff_location, cost]);
    res.json(newRide.rows[0]);
  } catch(err)
  {
      console.error(err.message);
      res.status(500).send("Server Error: adding a ride");
  }
});


// Retreive all ride
// GET: http://localhost:5001/rides
app.get("/rides",async(req,res)=>{
  try
  {
    const allRides = await pool.query("SELECT * FROM rides" );
    res.json(allRides.rows);
  }
  catch(err)
  {
      console.error(err.message);
      res.status(500).send("Server Error: getting all rides");
  }
})


// Retreive an ongoing ride with user ID
// GET: 
app.get("/ride/id/:user_id",async(req,res)=>{
  try
  {
    console.log("FETCHING RIDE INFO WITH USER ID: ", req.params.user_id);    //DEBUGGIN STATEMENT

    const {user_id} = req.params; 
    const ride = await pool.query("SELECT * FROM rides WHERE user_id = $1 AND status = 'pending';" , [user_id] );

    if(ride.rows.length===0)
    {
      return res.status(404).send("Ride not found with the USER ID provided");
    }
    res.json(ride.rows[0]);
  }
  catch(err)
  {
      console.error(err.message);
      return res.status(500).send("Server Error: getting a ride info with user id");
  }
})

// Delete a ride
// DELETE: http://localhost:5001/rides/delete/(id)
app.delete("/rides/delete/:id",async(req,res)=>{

  try{
    const {id} = req.params;
    console.log("Deleting ride with ID: ", id);

    const deleteRide = await pool.query("DELETE FROM rides WHERE id = $1 RETURNING *;", [id]);

    if(deleteRide.rows.length===0)
      {
       return res.status(404).send("Ride not found with the id provided");
      }
    res.json({message: "Successful: Ride deleted"});

  } catch(err)
  {
    console.error(err.message);
    res.status(500).send("Server Error: deleting a ride");
  }
});

function authenticateToken(req,res,next)
{
  console.log("Received Headers:", req.headers); 
  const authHeader = req.headers["authorization"]; 
  const token = authHeader && authHeader.split(' ')[1];

  console.log("Authorization Header:", authHeader);
  //console.log(token);

  if(!token)
  {
    return res.status(401).send("No Tokens");
  }

  jwt.verify(token,process.env.ACCESS_TOKEN, (err,user) =>{
    if(err)
    {
      return res.status(403).send("Verification failed");
    }
    console.log("In authToken() , User: ",user);
    
    req.user = user;
    console.log("reached next");
    next();
  });

}

app.listen(5001,()=>{
  console.log("server has started on port 5001");
});

/*
Sample JSON BODY for add user:
{
  "name": "Whatever Bro",
  "email": "bro@example.com",
  "password": "mybro"
}
*/

/*
Sample JSON BODY for update password:
{
  "newPassword": "newPW"
}
*/

/*
Sample JSON BODY for create ride:
{
  "user_id": 5,
  "pickup_location": "UCLA Store",
  "dropoff_location": "Compton",
  "cost": 5.9
}
*/



//Self note:
// Error codes:
// 400 Bad requests (Client Error, Incorrect Input)
// 404 Not found (Fetch request does not exists in the database)
// 500 Server Internal Error

// 401 unauthorized
// 403 forbidden
// 409 Conflict

//Template:
// app.post("/rides",async(req,res)=>{

//   try{

//   } catch(err)
//   {
    
//   }
// });

// Considerations:
// Can one user have two active rides?

