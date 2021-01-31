const mongoose = require("mongoose");

//registration form schema
const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdById: {
    type: String,
    required: true,
  },
  ph_no: {
    type: Number,
  },
  location: {
    type: String,
  },
  post: {
    type: String,
    required: true,
  },
  postCreatorId: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: String,
    required: true,
  },
});

//creating a collection

const Volunteer = new mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
