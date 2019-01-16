
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;


var Schema = new mongoose.Schema({
  payment_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  project_id: { type: Number, default: -1 },
  //
  user_id: { type: Number, default: -1 },
  //
  creator_id: { type: Number, default: -1 },
  //
  billing_address_id: { type: Number, default: -1 },
  //
  shipping_address_id: { type: Number, default: -1 },
  //
  amount: { type: Number, default: -1 },
  //amout of quote 
  shipping_amount: { type: Number, default: -1 },
  //shipping amount of quote 
  discount_amount: { type: Number, default: -1 },
  //
  cod_amount: { type: Number, default: -1 },
  //
  payment_amount: { type: Number, default: -1 },
  //
  shipping_method: { type: String, default: "", lowercase: true },
  //shipping_method
  coupon_code: { type: String, default: "", lowercase: true },
  //
  payment_method: { type: String, default: "", lowercase: true },
  //
  payment_status: { type: String, default: "", lowercase: true },
  //
  payment_response: { type: String, default: "", lowercase: true },
  //
  order_id: { type: String, default: "", lowercase: true },
  //
  status: { type: String, default: 0 },
  //status of project it can possible any thing.(0 means it is created.)
  created_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  updated_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  context: { type: Object, default: null },
  //json object for future back hand purpose.
  is_deleted: { type: Boolean, default: false },
  //project is deleted or not.
  is_active: { type: Boolean, default: false }
  //is this address is active or not.
},
  // schema options: Don't forget this option
  // if you declare foreign keys for this schema afterwards.
  {
    toObject: { virtuals: true },
    // use if your results might be retrieved as JSON
    // see http://stackoverflow.com/q/13133911/488666
    toJSON: { virtuals: true }
  });
// Foreign keys definitions

// Schema.virtual('userdetails', {
//   ref: 'User',
//   localField: 'user_id',
//   foreignField: 'user_id',
//   justOne: true // for many-to-1 relationships
// });

// Schema.virtual('productdetails', {
//   ref: 'product',
//   localField: 'product_id',
//   foreignField: 'product_id',
//   justOne: true // for many-to-1 relationships
// })

//Add New Config here

Schema.set('collection', 'Payments');
Schema.pre('save', function(next) {
  utilityService.updateDateWhenChangeHappen(this);
  next();
});
const model = mongoose.model('Payments', Schema);

module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.