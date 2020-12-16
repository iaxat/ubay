"use strict";

const Product = require("../models/product");

const moment = require('moment');

module.exports = {
  //Finds products that are up for auction and not approved so that admin can approve the auctions
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
//Finds products that are up for purchase and not approved so that admin can approve the shopping products
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
//handles the admin request for approving the bid
  approveBid: (req, res, next) => {
    let a = new Date();
    a.setDate(a.getDate() + 1);
    a = a.getTime()
    let b = new Date();
    b = b.getTime();
    console.log("dif in hours: ", (a - b) / (1000 * 60 * 60));

    let now = moment();
    console.log(now.format());
    
    let productId = req.params.id,
      productParams = {
        isApproved: true,
        time: a,
        remainingTime: (a - b) / (1000 * 60 * 60),
        dateApproved: now.format()
      };  
    Product.findByIdAndUpdate(productId, {
      $set: productParams
    })
      .then(products => {
        res.locals.redirect = "/admin/bidding";
        next();
      })
      .catch(error => {
        console.log(`Error updating product by ID: ${error.message}`);
        next(error);
      });
  },
  //handles the admin request for approving the shopping
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
  //handles the admin rrequest for disapproval of products
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
