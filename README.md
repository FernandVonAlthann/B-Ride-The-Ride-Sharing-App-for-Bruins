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

### /src/app/

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

### /src/app/

layout.tsx,
ThemeProvider.tsx

### /src/app/api/

auth.ts,
signup.ts,
locations.ts,
splitFare.ts,
emergency-contact,
group-chat,
language,
threads,
messages,
profile,
profile.ts,
reviews,
ride-history,
rides,
saved-locations

### /src/components/auth/

Login.tsx,
Signup.tsx

### /src/components/

FareSplit.tsx,
Map.tsx,
Profile.tsx,
RideETA.tsx,
RideList.tsx

### /src/components/ui/

button.tsx,
card.tsx,
input.tsx,
textarea.tsx

### /src/lib/db.ts

### /backend/server/

index.js,
database.sql

# Frontend

### /src/app/globals.css
