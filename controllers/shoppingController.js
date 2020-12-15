"use strict";

const Product = require("../models/product");

module.exports = {
  index: (req, res, next) => {
    Product.find({ forBidding: "false", isApproved: "true"})
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
    res.render("shopping/index");
  },
  sell: (req, res) => {
    res.render("./shopping/sell");
  },

  create: (req, res, next) => {

    console.log("in shopping")
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
      category: req.body.category,
      forBidding: "false",
      imageUrl: sampleFile1.name,
      // status: "approved",
    };
    Product.create(productParams)
      .then(product => {
        res.locals.redirect = "/shopping";
        res.locals.product = product;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },
  addToCart: (req,res,next) =>{
    let prod_id=req.params.id;
    try {
      Product.findByIdAndUpdate(prod_id,{$set : {inCart: true}}
        ).then(k=>{
          res.locals.redirect="/shopping/cart";
          next();
        })
    } catch (error) {
      next(error);
    }
  },
  showCart: (req,res,next) =>{
    try {
      Product.find({ forBidding: "false", isApproved: "true", inCart:true, user_id})
      .then(products => {
        res.locals.products = products;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
    } catch (error) {
      console.log(error);
    }
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

};
