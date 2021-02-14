const mongoose = require("mongoose");

//registration form schema
const comment = new mongoose.Schema({
  commented_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  post_con: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: String,
    required: true,
    default: Date.now(),
  },
});

//creating a collection

const Comment = new mongoose.model("Comment", comment);

module.exports = Comment;
