// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
hbs.registerHelper("dateFormat", require("handlebars-dateformat"));
hbs.registerPartials(__dirname + "/views/partials");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
require("./config/session.config")(app);

// app.use((req, res, next) => {
//   res.locals.isLoggedIn = req.session.currentUser ? true : false;
//   res.locals.isLoggedOut = !res.locals.isLoggedIn;
//   next();
// });

const helpers = require('./config/helpers');
// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "olas-project2";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

const profileRoute = require("./routes/profile.routes");
app.use("/", profileRoute);

const loginRoutes = require("./routes/auth/login.routes");
app.use("/", loginRoutes);

const signupRoutes = require("./routes/auth/signup.routes");
app.use("/", signupRoutes);

const postRoutes = require("./routes/post.routes");
app.use("/", postRoutes);

const aboutRoutes = require("./routes/about.routes");
app.use("/", aboutRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
