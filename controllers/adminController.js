"use strict";

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

  approveBid: (req, res, next) => {
    let a = new Date();
    a.setDate(a.getDate() + 1);
    a = a.getTime()
    // console.log("set data : ", a);

    let b = new Date();
    b = b.getTime();
    // console.log("current time : ", b);
    console.log("dif in hours: ", (a - b) / (1000 * 60 * 60));
    
    let productId = req.params.id,
      productParams = {
        isApproved: true,
        time: a,
        remainingTime: (a - b) / (1000 * 60 * 60),
      };  
    Product.findByIdAndUpdate(productId, {
      $set: productParams
    })
      .then(products => {
        res.locals.redirect = "/admin/bidding";
        // res.locals.product = products;
        next();
      })
      .catch(error => {
        console.log(`Error updating product by ID: ${error.message}`);
        next(error);
      });
  },
  approveShop : (req, res, next) => {
    let productId = req.params.id,
      productParams = {
        isApproved: true,
      };  
    Product.findByIdAndUpdate(productId, {
      $set: productParams
    })
      .then(products => {
        res.locals.redirect = "/admin/shopping";
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
