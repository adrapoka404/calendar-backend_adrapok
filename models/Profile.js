const { Schema, model } = require("mongoose");

const ProfileSchema = Schema({
  addr: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
    default: "MX",
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  mname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});

module.exports = model("Profile", ProfileSchema);
