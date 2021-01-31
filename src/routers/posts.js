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
  if (req.query.id && req.query.user == 1)
    query = { createdByID: req.query.id };
  //by post id
  else if (req.query.id && req.query.user == 0) query = { _id: req.query.id };
  const response = await Cause.find(query);
  res.json({
    status: "OK",
    cause: response,
  });
});

router.post(
  "/api/cause",
  auth,
  upload.single("uploadPostimg"),
  async (req, res) => {
    try {
      let bitmap = fs.readFileSync(
        path.join(__dirname, "../public/image/", req.file.filename)
      );
      let file = new Buffer.from(bitmap).toString("base64");
      const { title, content, createdBy, createdByID } = req.body;
      const causeDetail = new Cause({
        title,
        content,
        createdBy,
        media: file,
        mediaType: req.file.mimetype,
        createdByID: createdByID,
        dateCreated: getCurrentTime(),
      });

      const response = await causeDetail.save();
      // const mediaResponse = await mediaAttached.save();

      fs.unlink(
        path.join(__dirname, "../public/image/", req.file.filename),
        () => {}
      );
      res.status(201).json({
        status: "Cause Created",
        cause: response,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

router.get("/api/ad", auth, async (req, res) => {
  let query = {};
  // created by a particular user
  if (req.query.id && req.query.user == 1)
    query = { createdByID: req.query.id };
  //by post id
  else if (req.query.id && req.query.user == 0) query = { _id: req.query.id };
  const response = await Advertisement.find(query);

  res.json({
    status: "OK",
    AD: response,
  });
});

router.post(
  "/api/ad",
  auth,
  upload.single("uploadPostimg"),
  async (req, res) => {
    try {
      let bitmap = fs.readFileSync(
        path.join(__dirname, "../public/image/", req.file.filename)
      );

      let file = new Buffer.from(bitmap).toString("base64");
      const { title, content, createdBy, createdByID } = req.body;
      const adDetail = new Advertisement({
        title,
        content,
        createdBy,
        createdByID: createdByID,
        media: file,
        mediaType: req.file.mimetype,
        dateCreated: getCurrentTime(),
      });

      const response = await adDetail.save();

      fs.unlink(
        path.join(__dirname, "../public/image/", req.file.filename),
        () => {}
      );
      res.status(201).json({
        status: "Ad Created",
        AD: response,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

router.get("/api/comment/:id", auth, async (req, res) => {
  // console.log(req.params);
  const response = await Comment.find({ post_con: req.params.id });
  res.json({
    status: "OK",
    comment: response,
  });
});

router.post("/api/comment/", auth, async (req, res) => {
  try {
    const { commented_by, desc, post_con } = req.body;
    const comment = new Comment({
      commented_by,
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
    const {
      name,
      createdBy,
      createdById,
      ph_no,
      location,
      post,
      postCreatorId,
    } = req.body;

    const volunteer = new Volunteer({
      name,
      createdBy,
      createdById,
      ph_no,
      location,
      post,
      postCreatorId,
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
    const { name, ph_no, post, createdById, createdBy } = req.body;

    const lead = new Lead({
      name,
      ph_no,
      post,
      createdById,
      createdBy,
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
    response = await Volunteer.find({ postCreatorId: req.query.id });
  } else {
    response = await Volunteer.find({ createdById: req.query.id });
  }
  let vposts = [];

  await response.forEach(async (obj) => {
    let x = await Cause.findOne({ _id: obj.post });
    vposts.push(x);
  });
  setTimeout(() => {
    res.json({ volunteer: response, posts: vposts });
  }, 500);
});

router.get("/api/lead", auth, async (req, res) => {
  const response = await Lead.find({ createdById: req.query.id });
  let Lposts = [];

  await response.forEach(async (obj) => {
    let x = await Advertisement.find({ _id: obj.post });
    Lposts.push(x);
  });
  setTimeout(() => {
    res.json({ lead: response, posts: Lposts });
  }, 500);
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
      username: response.username || null,
      contact: response.ph_no || null,
    });
  else res.send("no user");
});

// router.post("/api/test", auth, (req, res) => {
//   const { title, content, createdBy, createdByID } = req.body;
//   res.send(title);
// });
module.exports = router;
