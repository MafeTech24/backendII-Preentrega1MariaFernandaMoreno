const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const productosSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  categoria: { type: String, required: true },
  thumbnails: { type: [String], default: [] },
}, {
  timestamps: true
});


productosSchema.plugin(mongoosePaginate);


const productosModelo = mongoose.model("Producto", productosSchema);


module.exports = { productosModelo };
