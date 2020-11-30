"use strict";

const product = require("../models/product");
const Product = require("../models/product");

module.exports = {
  index: (req, res, next) => {
    Product.find({forBidding: "true", isApproved: "false"})
      .then(products => {
        res.locals.product = products;
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
  approve: (req, res, next) =>{
    let productId = req.params.id,
        productParams = {
        // user_id: req.user._id,
        // productName : req.product.productName,
        // description: req.body.description,
        // price: req.body.price,
        // category: req.body.category,
        // forBidding: req.body.forBidding,
        isApproved: true,
    };

    Product.findByIdAndUpdate(productId, {
        $set: productParams
      })
      .then(products => {
        res.locals.redirect = "/admin";
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
