const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middlewares.js");
const userController = require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignUpFrom)
.post(wrapAsync (userController.createUser));

router.route("/login")
.get(userController.renderLoginForm)
.post( saveRedirectedUrl,passport.authenticate("local", 
        {failureRedirect: "/login", failureFlash:true}), userController.loginUser);


router.get("/logout", userController.logoutUser);

module.exports = router;

