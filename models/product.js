"use strict";

const mongoose =require("mongoose"),
{Schema}= mongoose,
productSchema = new Schema(
    {
        user_id:{
            type:String,
            required:true
        },
        productName:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        // image:{
        //     data: Buffer, 
        // contentType: String ,
        // required: true
        // },
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