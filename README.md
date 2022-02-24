<div align='center'>

# FilmFever API

RESTful API built with Node.js and Express to be used with FilmFever application. It creates, reads, updates, and deletes data from a MongoDB database. Users are assigned a JSON Web Token to ensure access to the other endpoints of the API and are provided security through the use of password hashing.

Initial 1.0 Version Duration: October 2021 - November 2021

</div>
 
## 🧐About

This project was built for the purpose of gaining more experience with back-end development using Node.js, Express, and other related packages. 

## 💡Features

1. Password hashing for security
2. JSON Web Token generation for user authentication
3. Request logging with morgan

## ⛏️Built with
  "dependencies"
  
    "bcrypt": "^5.0.1",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-validator": "^6.13.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.0.12",
    "mongoose-to-swagger": "^1.4.0",
    "morgan": "^1.10.0",
    "passport": "^0.5.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "swagger-jsdoc": "^6.1.0",
    "swagger-ui-express": "^4.3.0",
    "uuid": "^8.3.2"
  "devDependencies": 
  
    "nodemon": "^2.0.14"
## 🏁Getting Started

These instructions will help you to setup your own copy of FilmFever-API on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## 📚Prerequisite

#### //Necessary
- Node & NPM
- 
## 🧰Installation

1. Clone this repo
2. Install all the dependencies listed above using ```npm install```
3. Tweak code depending on local settings
4. Run ```node app.js``` or (optionally)```nodemon app.js``` in your terminal to start local server

## 🎈Usage

FilmFever API is a great example of an applicaion server built from scratch.

## ✍️Authors
@Myles-the-Coder - Initial Work

## 🧬Resources

- Express docs
- Mongoose docs
- MDN CORS docs
- Node.js docs
- Swagger UI docs
- Mongoose docs

## 🎉Acknowledgement
CareerFoundry
