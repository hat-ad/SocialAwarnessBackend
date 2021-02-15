const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const Cause = require("../models/cause");
const Advertisement = require("../models/advertisement");
const Media = require("../models/media");
const Volunteer = require("../models/volunteer");
const Lead = require("../models/lead");
const Comment = require("../models/comment");

const auth = require("../middleware/auth");
const User = require("../models/user");
const path = require("path");

const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/image/"));
  },

  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const getCurrentTime = () => {
  const date = new Date();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // let weekdays = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  return `${
    months[date.getMonth()]
  } ${date.getDate()} at ${date.getHours()}:${date.getMinutes()}`;
};

const upload = multer({
  storage: storage,
});
router.get("/api/cause", auth, async (req, res) => {
  let query = {};
  // created by a particular user
  if (req.query.id && req.query.user == 1) query = { createdBy: req.query.id };
  //by post id
  else if (req.query.id && req.query.user == 0) query = { _id: req.query.id };
  const response = await Cause.find(query)
    .populate("createdBy")
    .sort({ created_at: -1 });
  res.json({
    status: "OK",
    cause: response,
  });
});

router.post("/api/cause", auth, async (req, res) => {
  try {
    // console.log(req.user);
    const { title, content, media, mediaType } = req.body;
    const causeDetail = new Cause({
      title,
      content,
      createdBy: req.user,
      media,
      mediaType,
      dateCreated: getCurrentTime(),
    });

    const response = await causeDetail.save();
    // const mediaResponse = await mediaAttached.save();

    res.status(201).json({
      status: "Cause Created",
      cause: response,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/api/ad", auth, async (req, res) => {
  let query = {};
  // created by a particular user
  if (req.query.id && req.query.user == 1)
    query = { createdByID: req.query.id };
  //by post id
  else if (req.query.id && req.query.user == 0) query = { _id: req.query.id };
  const response = await Advertisement.find(query)
    .populate("createdBy")
    .sort({ created_at: -1 });

  res.json({
    status: "OK",
    AD: response,
  });
});

router.post("/api/ad", auth, async (req, res) => {
  try {
    const { title, content, media, mediaType } = req.body;
    const adDetail = new Advertisement({
      title,
      content,
      createdBy: req.user,
      media,
      mediaType,
      dateCreated: getCurrentTime(),
    });

    const response = await adDetail.save();

    res.status(201).json({
      status: "Ad Created",
      AD: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/api/comment/:id", auth, async (req, res) => {
  // console.log(req.params);
  const response = await Comment.find({ post_con: req.params.id }).populate(
    "commented_by"
  );
  res.json({
    status: "OK",
    comment: response,
  });
});

router.post("/api/comment/", auth, async (req, res) => {
  try {
    const { desc, post_con } = req.body;
    const comment = new Comment({
      commented_by: req.user,
      desc,
      post_con,
      dateCreated: getCurrentTime(),
    });
    const response = await comment.save();

    res.status(201).json({
      status: "Comment Created",
      comment: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/api/volunteer", auth, async (req, res) => {
  try {
    const { name, ph_no, location, post } = req.body;

    const posts = await Cause.findOne({ _id: post });
    const volunteer = new Volunteer({
      name,
      createdBy: req.user,
      ph_no,
      location,
      post: posts,
      dateCreated: getCurrentTime(),
    });

    const response = await volunteer.save();

    res.status(201).json({
      status: "Volunteer Created",
      comment: response,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/api/lead", auth, async (req, res) => {
  try {
    const { name, ph_no, post } = req.body;
    const posts = await Advertisement.findOne({ _id: post });

    const lead = new Lead({
      name,
      ph_no,
      post: posts,
      createdBy: req.user,
      dateCreated: getCurrentTime(),
    });

    const response = await lead.save();

    res.status(201).json({
      status: "Lead Created",
      comment: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/api/volunteer", auth, async (req, res) => {
  let response = [];
  if (req.query.post == 1) {
    // volunteers
    response = await Volunteer.find({ post: req.query.id }).populate(
      "createdBy post"
    );
  } else {
    //volunteered
    response = await Volunteer.find({ createdBy: req.query.id }).populate(
      "createdBy post"
    );
  }

  res.json({ volunteer: response });
});

router.get("/api/lead", auth, async (req, res) => {
  const response = await Lead.find({ createdBy: req.query.id }).populate(
    "createdBy post"
  );

  res.json({ lead: response });
});

router.post("/api/appreciate/:id", auth, async (req, res) => {
  try {
    const response = await Cause.findByIdAndUpdate(
      req.params.id,
      { appreciateBy: req.body },
      {
        new: true,
      }
    );
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/api/interest/:id", auth, async (req, res) => {
  try {
    const response = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { interest_count: req.body },
      {
        new: true,
      }
    );
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/api/user/:id", auth, async (req, res) => {
  const response = await User.findOne({ _id: req.params.id });
  if (response != null)
    res.json({
      img: response.profile_img,
      name: response.name,
      email: response.email,
      username: response.username || "",
      contact: response.ph_no || "",
    });
  else res.send("no user");
});

router.post("/api/test", auth, (req, res) => {
  const { title, content, createdBy, createdByID } = req.body;
  res.send(title);
});
module.exports = router;
