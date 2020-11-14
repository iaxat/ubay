"use strict";

const { check, validationResult } = require("express-validator");

const User = require("../models/user"),
  passport = require("passport"),
  getUserDetails = body => {
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      username: body.username,
      password: body.password,
      phoneNumber: body.phoneNumber,
      address: {
        street: body.street,
        city: body.city,
        zipCode: body.zipCode
      }
    }
  };

module.exports = {
  login: (req, res) => {
    res.render("./users/login");
  },
  new: (req, res) => {
    res.render("./users/new");
  },
  create: (req, res, next) => {
    if (req.skip) next();

    let newUser = new User(getUserDetails(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!  Login now`);
        res.locals.redirect = "/users/signup";
        next();
      } else {
        req.flash("error", `Failed to create user account because: ${error.message}.`);
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        address: {
          zipCode: req.body.zipCode,
          street: req.body.street,
          city: req.body.city
        }
      };
    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  signup: (req, res) => {
    res.render("users/signup");
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),
  validate: async (req, res, next) => {
    await check("email").normalizeEmail({
      all_lowercase: true
    }).trim().run(req);
    await check("email", "Email is invalid").isEmail().run(req);
    await check("zipCode", "Zip code is invalid").notEmpty().isInt().isLength({
      min: 5,
      max: 5
    }).equals(req.body.zipCode).run(req);
    await check("password", "Password cannot be empty").notEmpty().run(req);
    await check("phoneNumber", "Phone number cannot be empty").notEmpty().run(req);
    await check("street", "street cannot be empty").notEmpty().run(req);
    await check("city", "City cannot be empty").notEmpty().run(req);

    const error = validationResult(req);
    if (!error.isEmpty()) {
      let messages = error.array().map(e => e.msg);
      req.skip = true;
      req.flash("error", messages.join(" and "));
      res.locals.redirect = "/users/new";
      next();
    } else {
      next();
    }
  },
  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  }
};