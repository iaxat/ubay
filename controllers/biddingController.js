"use strict";

const Product = require("../models/product");

module.exports = {
  index: (req, res, next) => {
    Product.find({forBidding: "true", status:"approved"})
      .then(product => {
        res.locals.product = product;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("bidding/index");
  },
  sell:(req,res)=>{
    res.render("./bidding/sell");
  },
  create: (req, res, next) => {
    let productParams = {
        user_id: req.user._id,
         productName : req.body.productName,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          forBidding: "true",
          status:"approved",
    };
    Product.create(productParams)
      .then(product => {
        res.locals.redirect = "/bidding";
        // res.locals.product = product;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },
 
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
},
};
