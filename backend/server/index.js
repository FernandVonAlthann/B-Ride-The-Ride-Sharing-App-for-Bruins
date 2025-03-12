const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("server is running.");
});
app.put("/users/update/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { name, bio, language, ride_preference } = req.body;
    console.log(`Updating user with ID: ${userId}`, { name, bio, language, ride_preference });

    await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2",
      [name, userId]
    );

    const updateProfile = await pool.query(
      "UPDATE profiles SET bio = $1, language = $2, ride_preference = $3 WHERE user_id = $4 RETURNING *",
      [bio, language, ride_preference, userId]
    );

    if (updateProfile.rowCount === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json({ message: "Profile updated successfully", user: updateProfile.rows[0] });
  } catch (err) {
    console.error("Server error updating profile:", err.message);
    res.status(500).send("Server error: updating user profile");
  }
});
// Add User
app.post("/users/add", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const duplicateEmailExists = await pool.query(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );

    if (duplicateEmailExists.rows.length > 0) {
      return res.status(400).json({ error: "Error: Email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [name, email, hashedPassword]
    );

    const userId = newUser.rows[0].id;

    // Create a default profile for the user
    await pool.query(
      "INSERT INTO profiles (user_id, bio, profile_pic, language, ride_preference) VALUES ($1, 'No bio set', '/default-avatar.png', 'English', 'Comfort');",
      [userId]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error: adding a user");
  }
});

// Get User by Email (Including Profile)
app.get("/users/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await pool.query(
      `SELECT 
        users.id, users.name, users.email, 
        profiles.bio, profiles.profile_pic AS profile_picture, 
        profiles.language, profiles.ride_preference
      FROM users
      LEFT JOIN profiles ON users.id = profiles.user_id
      WHERE users.email = $1;`,
      [email.trim()]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Server Error: fetching user data." });
  }
});
app.post("/users/login", async (req, res) => {  // ✅ Ensure this is lowercase
  try {
    console.log("Reached login route");
    const { email, password } = req.body;
    const userQ = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userQ.rows.length < 1) {
      return res.status(400).json({ error: "Email has not been registered." });
    }

    const user = userQ.rows[0];
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: "Incorrect email or password." });
    }

    const accessToken = jwt.sign(
      { userID: user.id, email: user.email },
      process.env.ACCESS_TOKEN
    );

    return res.json({
      message: "Login successful!",
      accessToken,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error: User Login" });
  }
});
// Create a Ride
app.post("/rides/create", async (req, res) => {
  const { user_id, from_city, to_city, pickup_location, dropoff_location, departure_time, cost, available_seats, description } = req.body;

  if (!user_id || !from_city || !to_city || !pickup_location || !dropoff_location || !departure_time || cost === undefined || !available_seats) {
    return res.status(400).json({ error: "All fields are required, including cost." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO rides (user_id, from_city, to_city, pickup_location, dropoff_location, departure_time, cost, available_seats, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [user_id, from_city, to_city, pickup_location, dropoff_location, departure_time, cost, available_seats, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting ride:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/rides/request", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID; // Extract user ID from the auth token
    const { from_city, to_city, pickup_location, dropoff_location, departure_time, description } = req.body;

    if (!from_city || !to_city || !pickup_location || !dropoff_location || !departure_time) {
      return res.status(400).json({ error: "All fields are required for requesting a ride." });
    }

    const newRequest = await pool.query(
      "INSERT INTO ride_requests (user_id, from_city, to_city, pickup_location, dropoff_location, departure_time, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [userId, from_city, to_city, pickup_location, dropoff_location, departure_time, description]
    );

    res.status(201).json({ message: "Ride request submitted!", data: newRequest.rows[0] });
  } catch (error) {
    console.error("Error requesting ride:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Retrieve all rides with driver details
app.get("/rides", async (req, res) => {
  try {
    const allRides = await pool.query(
  `SELECT rides.*, 
  COALESCE(rides.cost, NULL) AS cost,  -- Preserve actual cost values
  users.name AS driver_name, 
  profiles.profile_pic AS driver_profile_pic, 
  'offer' AS ride_type
  FROM rides 
  JOIN users ON rides.user_id = users.id 
  LEFT JOIN profiles ON users.id = profiles.user_id
  ORDER BY rides.departure_time ASC;`
);

    res.json(allRides.rows);
  } catch (err) {
    console.error("Error fetching rides:", err);
    res.status(500).send("Server Error: getting all rides");
  }
});
// Retrieve all rides (Offer + Request)
app.get("/rides/all", async (req, res) => {
  try {
    const offeredRides = await pool.query(
      `SELECT rides.*, users.name AS driver_name, profiles.profile_pic AS driver_profile_pic, 'offer' AS ride_type
      FROM rides 
      JOIN users ON rides.user_id = users.id 
      LEFT JOIN profiles ON users.id = profiles.user_id
      ORDER BY rides.departure_time ASC;`
    );

    const requestedRides = await pool.query(
      `SELECT ride_requests.*, users.name AS requester_name, profiles.profile_pic AS requester_profile_pic, 'request' AS ride_type
      FROM ride_requests
      JOIN users ON ride_requests.user_id = users.id 
      LEFT JOIN profiles ON users.id = profiles.user_id
      ORDER BY ride_requests.departure_time ASC;`
    );

    const allRides = [...offeredRides.rows, ...requestedRides.rows];

    res.json(allRides);
  } catch (err) {
    console.error("Error fetching all rides:", err);
    res.status(500).send("Server Error: getting all rides");
  }
});
app.get("/rides/user/:userId/recent", async (req, res) => {
  try {
    const userId = req.params.userId;

    const ride = await pool.query(
      "SELECT id, from_city AS from, to_city AS to, departure_time FROM rides WHERE user_id = $1 ORDER BY departure_time DESC LIMIT 1",
      [userId]
    );

    if (ride.rows.length === 0) {
      return res.status(404).json({ error: "No recent rides found." });
    }

    res.json(ride.rows[0]);
  } catch (err) {
    console.error("Error fetching recent ride:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a Ride (Only if the user is the owner)
// Delete a Ride or Ride Request (Only if the user is the owner)
app.delete("/rides/delete/:id", authenticateToken, async (req, res) => {
  try {
    const rideId = parseInt(req.params.id, 10);
    const userId = req.user.userID; // Extract user ID from the auth token

    if (isNaN(rideId)) {
      return res.status(400).json({ error: "Invalid ride ID" });
    }

    // Check if the ride exists in `rides` (offered rides)
    const rideQuery = await pool.query("SELECT * FROM rides WHERE id = $1 AND user_id = $2", [rideId, userId]);

    if (rideQuery.rows.length > 0) {
      await pool.query("DELETE FROM rides WHERE id = $1", [rideId]);
      return res.json({ message: "Ride deleted successfully" });
    }

    // Check if the ride exists in `ride_requests` (requested rides)
    const requestQuery = await pool.query("SELECT * FROM ride_requests WHERE id = $1 AND user_id = $2", [rideId, userId]);

    if (requestQuery.rows.length > 0) {
      await pool.query("DELETE FROM ride_requests WHERE id = $1", [rideId]);
      return res.json({ message: "Ride request deleted successfully" });
    }

    return res.status(403).json({ error: "Unauthorized: You can only delete your own rides or ride requests" });

  } catch (err) {
    console.error("Error deleting ride:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Messages System
app.post("/api/messages", authenticateToken, async (req, res) => {
  try {
    const { senderId, receiverId, rideId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "Sender, receiver, and message are required." });
    }

    // Ensure ride_id exists in either `rides` or `ride_requests`
    if (rideId) {
      const rideExists = await pool.query(
        "SELECT id FROM rides WHERE id = $1 UNION SELECT id FROM ride_requests WHERE id = $1",
        [rideId]
      );

      if (rideExists.rows.length === 0) {
        return res.status(400).json({ error: "Ride ID does not exist." });
      }
    }

    const newMessage = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, ride_id, message, sent_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [senderId, receiverId, rideId || null, message]
    );

    res.json({ message: "Message sent successfully!", data: newMessage.rows[0] });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/messages", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID; // Get the logged-in user ID from the token

    const messages = await pool.query(
      `SELECT * FROM messages 
       WHERE sender_id = $1 OR receiver_id = $1 
       ORDER BY sent_at ASC`, 
      [userId]
    );

    res.json({ messages: messages.rows });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID;

    const users = await pool.query(
      `SELECT DISTINCT u.id, u.name 
       FROM users u
       JOIN messages m 
       ON u.id = m.sender_id OR u.id = m.receiver_id
       WHERE u.id != $1`,
      [userId]
    );

    res.json({ users: users.rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});




// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("No Token Provided");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send("Verification Failed");
    }
    req.user = user;
    next();
  });
}

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

//NEED TO ORGANIZE
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

