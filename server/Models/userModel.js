const mongoose = require("mongoose");

require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    avatarId: {
      type: Number,
      required: true,
      min: 0,
      max: 4 // For the 5 possible avatars
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
