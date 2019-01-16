
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;
const utilityService = require('./../../service/utilityservice');

var Schema = new mongoose.Schema({
  quote_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  project_id: { type: Number, default: -1 },
  //project id of person who create a Address (-1 means not assigned )
  creator_id: { type: Number, default: -1 },
  //creator id of quote 
  amount: { type: Number, default: -1 },
  //amout of quote 
  shipping_amount: { type: Number, default: -1 },
  //shipping amount of quote 
  shipping_method: { type: String, default: "", lowercase: true },
  //shipping_method
  distance: { type: String, default: "5" },
  //distance from  location where project placed.
  advance: { type: Number, default: "0" },
  //advance payment in 
  cod: { type: Number, default: 0 },
  //cod
  self_payment_managed: { type: Boolean, default: false },
  //self_payment_managed
  shipping_on_self: { type: Boolean, default: false },
  //shipping_on_self
  selected: { type: Boolean, default: false },
  //
  comments: { type: String, default: "NA", lowercase: true },
  //
  attachments: { type: Object, default: null },
  //json object for future back hand purpose.
  status: { type: Boolean, default: false },
  //
  type: { type: String, default: "NA", lowercase: true },
  //NA means Still not assigned.
  withdraw_reason: { type: Number, default: 0 },
  //
  withdraw_comments: { type: String, default: "na" },
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


//Add New Config here
Schema.set('collection', 'Quote');
Schema.pre('save', function(next) {
  utilityService.updateDateWhenChangeHappen(this);
  next();
});
const model = mongoose.model('Quote', Schema);

module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.