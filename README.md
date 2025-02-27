# Insitute

University of California, Los Angeles - Samueli School of Engineering

# Course

Computer Science 35L Winter 25

# Project Title

B-Ride-The-Ride-Sharing-App-for-Bruins

# Group members

Fernando-Anscar Althann,
Terry Lee,
Ani Torosyan,
Neil Pal,
Karol Barroso

# Project Overview

This project aims to develop a ride-sharing application with core functionalities including that of authentication, GPS-based ride matching, ride filtering, and forum-style listings. Developed as a React web application, it's role is to provide users with an easily accessible and user-friendly interface.

# Git Repository Link

https://github.com/FernandVonAlthann/B-Ride-The-Ride-Sharing-App-for-Bruins

# Key Features

User authentication enables secure access to the system by allowing users to create accounts with unique credentials.

User profiles.

GPS-based assistance for users.

Technology Stack:

Node.js / React / Next.js / Tailwind CSS / PostgreSQL

Next.js App Router / Fetch HTTP Request / JWT Authentication
Git

# Setup Guide

Prerequisites

Node.js(version v20.11.0 or later)

npm (version 10.2.4 or later)

Git Installation

## Installation

1. Clone the repository
```
git clone https://github.com/FernandVonAlthann/B-Ride-The-Ride-Sharing-App-for-Bruins.git
```

2. Enter directory
```
cd B-Ride-The-Ride-Sharing-App-for-Bruins
```
3. Install dependencies
```
npm install
npm install leaflet
npm install bcrypt dotenv jsonwebtoken
npm install pg
```
3. In another terminal, initiate the database connection to server
```
cd B-Ride-The-Ride-Sharing-App-for-Bruins/backend/server
```
```
node index.js
```
6. Open [http://localhost:5001](http://localhost:5001) with your browser to see the result.
7. Run the application
```
npm run dev
```
8. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Components

AI-Chat-Assistant,
dark-mode,
dashboard,
emergency-contact,
faresplit,
find-ride,
forum,
group-chat,
language,
login,
map,
messages,
offer-ride,
payment,
profile,
profileapp,
Ratings-Reviews,
referral,
referral-redeem,
ride-cost,
ride-history,
ride-matching,
saved-locations,
signup

# Backend

/src/app/layout.tsx

/src/app/ThemeProvider.tsx

/src/app/api/auth.ts

/src/app/api/signup.ts

/src/app/api/locations.ts

/src/app/api/splitFare.ts

/src/app/api/emergency-contact

/src/app/api/group-chat

/src/app/api/language

/src/app/api/threads

/src/app/api/messages

/src/app/api/profile

/src/app/api/profile.ts

/src/app/api/reviews

/src/app/api/ride-history

/src/app/api/rides

/src/app/api/saved-locations

/src/components/auth/Login.tsx

/src/components/auth/Signup.tsx

/src/components/FareSplit.tsx

/src/components/Map.tsx

/src/components/Profile.tsx

/src/components/RideETA.tsx

/src/components/RideList.tsx

/src/components/ui/button.tsx

/src/components/ui/card.tsx

/src/components/ui/input.tsx

/src/components/ui/textarea.tsx

/src/lib/db.ts

/backend/server/index.js

/backend/server/database.sql

# Frontend

/src/app/globals.css
