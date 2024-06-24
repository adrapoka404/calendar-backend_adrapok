const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
});

module.exports = model("Usuario", UsuarioSchema);
