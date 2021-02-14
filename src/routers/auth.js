const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");

const RegisterUser = require("../models/user");
const auth = require("../middleware/auth");

const path = require("path");

const fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/image/"));
  },

  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

//creating a user
router.post("/api/register", async (req, res) => {
  try {
    const user = new RegisterUser(req.body);
    console.log(user);
    const response = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({
      status: "User created",
      user: response,
      token: token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//logging user
router.post("/api/users/get-token", async (req, res) => {
  try {
    const userDetail = await RegisterUser.findOne({ email: req.body.email });
    const isMatch = await bcrypt.compare(
      req.body.password,
      userDetail.password
    );

    const token = await userDetail.generateAuthToken();
    if (isMatch) {
      res.status(200).json({
        status: "user logged in",
        token: token,
        userId: userDetail._id,
      });
    } else {
      res.send("Invalid User Details");
    }
    console.log(token);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/api/user/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id; // to get the id in url
    const { username, ph_no, email, name, img } = req.body;
    // console.log(req.body.img);
    let response = await RegisterUser.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
