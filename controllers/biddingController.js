"use strict";

const Product = require("../models/product");
const User = require("../models/user");

module.exports = {
  //updates the remaining time for the bidding to expire
  updateProduct: (req, res, next) => {
    Product.find({ forBidding: "true", isApproved: "true" })
      .then(products => {

        products.forEach(prod => {
          let prod_id = prod._id;
          let a = new Date();
          a = a.getTime();
          let rem_time = (prod.time - a) / (1000 * 60 * 60);
          Product.findByIdAndUpdate(prod_id, {
            $set:
              { remainingTime: rem_time }
          }).then(k => {
          })
        })
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
  },
  //checks if remaining time has expired and then updates product status and item is added to winners orders
  validate: async (req, res, next) => {
    try{
    const products=await Product.find({ forBidding: "true", isApproved: "true" });
    
        products.forEach(async element => {
          let prod_id=element._id;
          if(element.remainingTime<=0){
            if(element.user_id_bid){
              const jjj=await Product.findByIdAndUpdate(prod_id,{$set:{isSold:true}});
              const lll=await User.findByIdAndUpdate(element.user_id_bid,{$addToSet:{orders:[prod_id]}});
            }else{
              const jjj=await Product.findByIdAndUpdate(prod_id,{$set:{isExpired:true}});          
            }
          };
      });
        next();
    }catch(error) {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      };
  },
  //finds the bid that is eligible for bidding
  index: async (req,res,next) =>{
    try {
      const products_2=await Product.find({ forBidding: "true", isApproved: "true" ,isSold:false, isExpired: false});
      res.locals.products = products_2;
        next(); 
    } catch (error) {
      console.log(error);
    }
  },
  indexView: (req, res) => {
    res.render("bidding/index");
  },
  sell: (req, res) => {
    res.render("./bidding/sell");
  },
  //inserting the product into the database
  create: (req, res, next) => {
    let sampleFile1 = req.files.sampleFile;
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
  //update the current price of the bid after a bid is placed
  placeBid : (req,res,next) =>{
    if(req.user){
    let prodId=req.params.id;
    let prod_currentPrice=req.params.id2;
    let newPrice = (prod_currentPrice * 1.10).toFixed(2);
    try {
      if(prodId.remainingTime>0){
      Product.findByIdAndUpdate(prodId,{$set: {currentPrice: newPrice , user_id_bid : req.user._id, username_bid:req.user.username}
    }).then(k => {
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
