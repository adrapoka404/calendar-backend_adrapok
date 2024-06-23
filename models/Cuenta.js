const { Schema, model } = require("mongoose");

const CuentaSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    dafault: "created",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  asignedTo: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pago",
    },
  ],
});

CuentaSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = model("Cuenta", CuentaSchema);
