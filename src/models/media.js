const mongoose = require("mongoose");

//registration form schema
const mediaSchema = new mongoose.Schema({
  media: {
    type: String,
  },
  postId: {
    type: String,
    unique: true,
  },
});

//creating a collection

const Media = new mongoose.model("Media", mediaSchema);

module.exports = Media;
