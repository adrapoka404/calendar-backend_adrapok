const { Schema, model } = require("mongoose");

const PagoSchema = Schema({
  event: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  auth_code: {
    type: String,
  },
  reference: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  plan: [],
  type: {
    type: String,
  },
  token: {
    type: String,
  },
  cancel_url: {
    type: String,
  },
});

PagoSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = model("Pago", PagoSchema);
