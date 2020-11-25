"use strict";

const product = require("../models/product");
const Product = require("../models/product");

module.exports = {
  index: (req, res, next) => {
    Product.find({forBidding: "true", isApproved: "false"})
      .then(products => {
        res.locals.products = products;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("admin/index");
  },
  approve: (req, res) =>{
    let productId = req.params._id,
        productParams = {
        user_id: req.user._id,
        productName : req.body.productName,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        forBidding: req.body.forBidding,
        isApproved: true,
    };

    Product.findByIdAndUpdate(productId, {
        $set: productParams
      })
        .then(course => {
          res.locals.redirect = `/bidding/index`;
          //res.locals.course = course;
          next();
        })
        .catch(error => {
          console.log(`Error updating course by ID: ${error.message}`);
          next(error);
        });

  },
 
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
},
};
