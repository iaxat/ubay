"use strict";

const Product = require("../models/product");
const User = require("../models/user");

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
    if(req.user){
    try {
      User.findByIdAndUpdate(req.user._id,{$addToSet:{inCartOrders:[prod_id]}}).then(l=>{
        console.log(l);

            res.locals.redirect="/shopping/cart";
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
  showCart: async (req,res,next) =>{
    if(req.user){
    try {
      let prod_cart_id= await User.findById(req.user._id,"inCartOrders").populate("inCartOrders");    
      console.log("hhhhh :  ",prod_cart_id);
      res.render("shopping/cart",{products: prod_cart_id.inCartOrders});
    } catch (error) {
      console.log(error);
    }
  }else{
    res.locals.redirect = "/bidding/login-message";
    res.render("bidding/login-message");
  }
  },
  buy:async (req,res,next) =>{
    let prod_id=req.params.id;
    if(req.user){
    try {
    const l1=await  User.findByIdAndUpdate(req.user._id,{$addToSet:{orders:[prod_id]}});
    const l2=await User.findByIdAndUpdate(req.user._id,{$pull:{inCartOrders: prod_id}});
            // console.log(l);
            res.locals.redirect="/shopping/orders";
            next();
      
    } catch (error) {
      next(error);
    }
  }else{
    res.locals.redirect = "/bidding/login-message";
    res.render("bidding/login-message");
  }
  },
  showOrders: async (req,res,next)=>{
    let prod_id=req.params.id;
    if(req.user){
    try {
      let prod_order_id= await User.findById(req.user._id,"orders").populate("orders");    
      console.log("dfghj :  ",prod_order_id);
      res.render("users/myOrders",{products: prod_order_id.orders});
    } catch (error) {
      console.log(error);
    }}else{
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