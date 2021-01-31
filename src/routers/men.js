const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");

const MensRanking = require("../models/mens");
const auth = require("../middleware/auth");

// //handling post request
// router.post("/api/mens", async (req, res) => {
//   try {
//     const response = await new MensRanking(req.body).save();
//     res.status(201).send(response);
//     // console.log(req.body);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// //handling get request
// router.get("/api/mens/:id", async (req, res) => {
//   try {
//     const _id = req.params.id; // to get the id in url
//     // const response = await MensRanking.find({}).sort({"ranking":1});
//     const response = await MensRanking.findById({ _id: _id });

//     res.status(200).send(response);
//     // console.log(req.body);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// //handling patch request
// router.patch("/api/mens/:id", async (req, res) => {
//   try {
//     const _id = req.params.id; // to get the id in url
//     const response = await MensRanking.findByIdAndUpdate(_id, req.body, {
//       new: true,
//     });

//     res.status(200).send(response);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// //handling delete request
// router.delete("/api/mens/:id", async (req, res) => {
//   try {
//     const _id = req.params.id; // to get the id in url
//     const response = await MensRanking.findByIdAndDelete(_id);

//     res.status(200).send(response);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

//creating a user
router.post("/api/register", async (req, res) => {
  try {
    const mensRanking = new MensRanking(req.body);
    const token = mensRanking.generateAuthToken();
    res.cookie("jwt", token, {
      HttpOnly: true,
      Secure: true,
    });
    res.status(201).send(mensRanking);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const userDetail = await MensRanking.findOne({ email: req.body.email });
    const isMatch = await bcrypt.compare(
      req.body.password,
      userDetail.password
    );

    const token = await userDetail.generateAuthToken();
    if (isMatch) {
      res.cookie("jwt", token, {
        HttpOnly: true,
        Secure: true,
      });
      res.status(200).send(token);
    } else {
      res.send("Invalid User Details");
    }
    console.log(token);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/api/home", auth, (req, res) => {
  res.send("welcome to home Screen");
});

module.exports = router;
