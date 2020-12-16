"use strict";

const Product = require("../models/product");
const User = require("../models/user");



// Helped in dealing with JSON data resulted from external api
var prettyjson = require('prettyjson');

const httpStatus = require("http-status-codes"),
    jsonWebToken = require("jsonwebtoken"),
    axios = require("axios");

module.exports = {
    
    // Fetches shopping products for api
    getProduct: (req, res, next) => {

     Product.find({ forBidding: "false", isApproved: "true"})
      .then(products => {
        products.forEach(product => {
            product.imageUrl = "http://localhost:3000/images/" + product.imageUrl;
        });
        res.locals.products = products;
        next();
      })
      .catch(error => {
        console.log(`Error fetching products: ${error.message}`);
        next(error);
      });
    },
    //  responds in JSON format 
    respondJSON: (req, res) => {
        res.json({
            status: httpStatus.OK,
            data: res.locals
        });
    },
    // sends back a secured web token
    getToken: (req, res, next) => {

        let signedToken = jsonWebToken.sign(
            {
                exp: new Date().setDate(new Date().getDate() + 1)
            },
            "secret_encoding_passphrase"
        );
        res.json({
            success: true,
            token: signedToken
        });
    },
    //  verifies the token 
    verifyToken: (req, res, next) => {

        jsonWebToken.verify(req.query.token, "secret_encoding_passphrase", (error, payload) => {
            if (error) {
                console.log("error")
                res.status(httpStatus.UNAUTHORIZED).json({
                    error: true,
                    message: "Provide Token"
                });
            } else {
                console.log("verified");
                next();
            }
        });
    },
    // handles the request for external api which renders a view with fake JSON data response
    externalApi: (req, res) => {
    
        axios('https://jsonplaceholder.typicode.com/todos').then(function (resp) {

            let options = {
                noColor: false
              };
               
              console.log(prettyjson.render(resp.data, options));

            res.render("external-api", { data: resp.data });
        });
    }
}