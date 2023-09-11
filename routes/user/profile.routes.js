const User = require("../../models/User.model");
const express = require('express');
const profileRouter = express.Router();
const fileUploader = require('../../config/cloudinary.config');


profileRouter.get("/profile", (req, res, next) => {
  res.render("user/profile")
});
profileRouter.post("/profile", fileUploader.single("user-image"), (req, res, next) => {
  const newImg = req.file.path;  
  const {currentUser} = req.session;
  const {_id} = currentUser;
  
});

module.exports = profileRouter;
