"use strict";

const product = require("../models/product");
const Product = require("../models/product");

module.exports = {
  bidding: (req, res, next) => {
    Product.find({forBidding: "true",isRejected:"false", isApproved: "false"})
      .then(products => {
        res.locals.product = products;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
  },

  biddingView: (req, res) => {
    res.render("admin/bidding");
  },

  shopping: (req, res, next) => {
    Product.find({forBidding: "false",isRejected:"false", isApproved: "false"})
      .then(products => {
        res.locals.product = products;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
  },

  shoppingView: (req, res) => {
    res.render("admin/shopping");
  },

  approve: (req, res, next) =>{
    let productId = req.params.id,
        productParams = {
        isApproved: true,
        // time : Date.now + 1
    };
    Product.findByIdAndUpdate(productId, {
        $set: productParams
      })
      .then(products => {
        if(products.forBidding){
          res.locals.redirect = "/admin/bidding";
        } else{
          res.locals.redirect = "/admin/shopping";
        }
        res.locals.product = products;
          next();
        })
        .catch(error => {
          console.log(`Error updating product by ID: ${error.message}`);
          next(error);
        });
  },
  disapprove: (req, res, next) =>{
    let productId = req.params.id,
        productParams = {
        isRejected: true,
    };
    Product.findByIdAndUpdate(productId, {
        $set: productParams
      })
      .then(products => {
        if(products.forBidding){
          res.locals.redirect = "/admin/bidding";
        } else{
          res.locals.redirect = "/admin/shopping";
        }
        res.locals.product = products;
          next();
        })
        .catch(error => {
          console.log(`Error updating product by ID: ${error.message}`);
          next(error);
        });
  },
 
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
},
};
