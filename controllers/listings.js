const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const access_token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: access_token });


module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async(req, res, next) => {
    // let {title, description, image, lacation, country, price} = req.body;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
   let savedListing = await newListing.save();
   console.log(savedListing);
    req.flash("success", "New Listing Added !");
    res.redirect("/listings");
}


module.exports.renderEditFrom = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    updatedImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    if(!listing){
        req.flash("error", "Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing, updatedImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
   let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}