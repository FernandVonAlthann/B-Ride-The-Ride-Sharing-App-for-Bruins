const express = require("express");
const cors = require("cors")
const pool = require("./db")

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Routes

app.get("/",(req,res)=>{
    res.send("server is running.");
})

// USER: 

// Add user
//TODO: check for duplicate emails
app.post("/users",async(req,res)=>{
    try
    {
      const { name,email,password }=req.body;
      const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [name, email, password]
      );
      res.json(newUser.rows[0]);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server error when adding a user");
    }
})

app.listen(5001,()=>{
    console.log("server has started on port 5001");
});

