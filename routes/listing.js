const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin, isOwner, validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));


// NEW ROUTE placing above :id so it wont search new in db
router.get("/new", isLoggedin,listingController.renderNewForm);

router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(listingController.renderEditFrom));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(listingController.destroyListing));

// edit route


module.exports = router;