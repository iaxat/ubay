"use strict";

const Product = require("../models/product");

module.exports = {
  updateProduct: (req, res, next) => {
    // console.log("in index");
    Product.find({ forBidding: "true", isApproved: "true" })
      .then(products => {

        products.forEach(prod => {
          let prod_id = prod._id;
          let a = new Date();
          a = a.getTime();
          let rem_time = (prod.time - a) / (1000 * 60 * 60);
          // console.log(prod.productName, " ---", prod.time, " and ", rem_time);

          Product.findByIdAndUpdate(prod_id, {
            $set:
              { remainingTime: rem_time }
          }).then(k => {
            // console.log(k)
          })
        }
        )
        // res.locals.products = products;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
  },
  index: (req, res, next) => {
    Product.find({ forBidding: "true", isApproved: "true" })
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
    res.render("bidding/index");
  },
  sell: (req, res) => {
    res.render("./bidding/sell");
  },
  create: (req, res, next) => {
    let sampleFile1 = req.files.sampleFile;
    console.log(sampleFile1);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    sampleFile1.mv('public/images/' + sampleFile1.name, function (err) {
      if (err)
        return res.status(500).send(err);
    });

    let productParams = {
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      currentPrice: req.body.price,
      category: req.body.category,
      forBidding: "true",
      imageUrl: sampleFile1.name,
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
  placeBid : (req,res,next) =>{
    if(req.user){
    let prodId=req.params.id;
    let prod_currentPrice=req.params.id2;
    console.log(prod_currentPrice)
    try {
      console.log(req.user);
      Product.findByIdAndUpdate(prodId,{$set: {currentPrice: prod_currentPrice*1.10 , user_id_bid : req.user._id}
    }).then(k => {
      // console.log(k);
      res.locals.redirect = "/bidding";
      next();
    })
    } catch (error) {
      next(error);
    }
  }else{
    res.locals.redirect = "/bidding/login-message";
    res.render("bidding/login-message");
  }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
};
