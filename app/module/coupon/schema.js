
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;
const utilityService=require('./../../service/utilityservice');

var Schema = new mongoose.Schema({
  coupon_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  code: { type: String, default: "Bulb And Key Project", lowercase: true, trim: true },
  //Name 
  total_usage: { type: Number, default: 0 },
  //
  usage_per_customer: { type: Number, default: 0 },
  //
  times_used: { type: Number, default: 0 },
  //
  expiry_date: { type: Date, default: Date.now() },
  //
  is_primary: { type: Boolean, default: false },
  //
  parent_id: { type: Number, default: -1 },
  //
  rules: { type: Object, default: null },
  //which category has allowed to use this coupon code.
  status: { type: Boolean, default: false },
  //
  created_date: { type: Date, default: Date.now() },
  //created date .
  updated_date: { type: Date, default: Date.now() },
  //created date 
  context: { type: Object, default: null },
  //json object for future back hand purpose.
  is_deleted: { type: Boolean, default: false },
  //Address is deleted or not.
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


Schema.set('collection', 'Coupon');
Schema.pre('save', function(next) {
  utilityService.updateDateWhenChangeHappen(this);
  next();
});
const model = mongoose.model('Coupon', Schema);

// UserSchema.set('collection', 'User');
// const usermodel = mongoose.model('User', UserSchema);





module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.