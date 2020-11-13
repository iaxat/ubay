"use strict";

const Product = require("../models/product");

module.exports = {
  index: (req, res) => {
    res.render("index");
  },
  contact: (req, res) => {
    res.render("contact");
  },
  category: (req, res, next) => {
    let cat=req.params.id;
    console.log(cat);
    Product.find({status:"approved", category:cat})
      .then(product => {
        res.locals.product1 = product;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
  },
  categoryView: (req, res) => {
    res.render("home/categories");
  },
};
