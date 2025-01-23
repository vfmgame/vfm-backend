const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const Secrets = require("../config");
const path = require("path")
const { authRoutes, userRoutes, } = require("../api");

module.exports = async (app) => {
  app.get("/status", (req, res) => { res.status(200).end(); });
  app.head("/status", (req, res) => { res.status(200).end(); });
  app.enable("trust proxy");
  app.disable('x-powered-by'); // less hackers know about our stack

  app.set("view engine", "ejs")
  app.set("views", [path.join(__dirname, "views",)])
  app.use(express.static(__dirname + "/public"))


  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  
  app.use(cors({
      origin: [Secrets.LOCAL_BASE_URL, Secrets.STAGING_BASE_URL, Secrets.STAGING_BASE_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  ));
  

 

  // App Middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));
  
  
  app.set("trust proxy", 1) // trust first proxy
  
  
  app.use(require('morgan')('dev'));


  app.get("/api/v1", async (req, res) => {
    res.send("VFM Backend Service");
  });

  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);




  // ...More middlewares

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Route Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });






  app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500);
    res.json({
      status: err.statusCode,
      error: true,
      message: err.message,
    });
  });

  // Return the express app
  return app;
}