"use strict";

const Product = require("../models/product");

module.exports = {
  index: (req, res, next) => {

    Product.find({ forBidding: "true", isApproved: "true" })
      .then(products => {
        products.forEach(prod => {
          let prod_id=prod._id;
          let a = new Date();
          a = a.getTime();
          let rem_time = (prod.time - a) / (1000 * 60 * 60);
          console.log(prod.productName, " ---", prod.time, " and ", rem_time);
          
          Product.findByIdAndUpdate(prod_id,{
              $set:
                { remainingTime: rem_time }
          }).then(k=>{
            console.log(k)
          })
        }
        )
        res.locals.products = products;
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
          // status:"approved",
    };
    Product.create(productParams)
      .then(product => {
        res.locals.redirect = "/bidding";
        res.locals.products = product;
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
