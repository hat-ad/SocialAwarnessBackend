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

// query profimg 1 for profile update and 0 for others
router.patch("/api/user/:id", auth, upload.single("img"), async (req, res) => {
  try {
    const _id = req.params.id; // to get the id in url
    let response = "";
    console.log(req.query.profImg);
    if (req.query.profImg == "1") {
      let bitmap = fs.readFileSync(
        path.join(__dirname, "../public/image/", req.file.filename)
      );

      let file = new Buffer.from(bitmap).toString("base64");
      let img_file = `data:${req.file.mimetype};base64,${file}`;
      response = await RegisterUser.findByIdAndUpdate(
        _id,
        { profile_img: img_file },
        {
          new: true,
        }
      );
      await fs.unlink(
        path.join(__dirname, "../public/image/", req.file.filename),
        () => {}
      );
    } else {
      response = await RegisterUser.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
    }
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
