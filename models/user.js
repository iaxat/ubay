const mongoose= require("mongoose"),
{ Schema} = mongoose,
passportLocalMongoose = require("passport-local-mongoose");

userSchema = new Schema(
    {
        name: {
            first: {
                type: String,
                required: true,
                trim: true
            },
            last: {
                type: String,
                required: true,
                trim: true
            }
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        username: {
            type: String, 
            required: true,
            unique: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            zipCode: {
                type: Number,
                min: [10000, "Zip Code Too Short"],
                max: 99999
            }
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }
)

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);