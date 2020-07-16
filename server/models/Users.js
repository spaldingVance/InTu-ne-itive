const mongoose = require("mongoose");
const { string } = require("prop-types");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    password: {
      type: String
    },
    
  }
)