"use strict";

const mongoose =require("mongoose"),
{Schema}= mongoose;

productSchema = new Schema(
    {
        productName:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        image:{
            type: Image,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        category:{
            type: String,
            required: true
        },
        forBidding:{
            type: Boolean,
            required: true
        },
        status:{
            type: String
        }
    }
)

module.exports = mongoose.model("Product", productSchema);