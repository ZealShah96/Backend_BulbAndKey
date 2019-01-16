
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;
var utilityService = require('./../../service/utilityservice');

var Schema = new mongoose.Schema({
  creator_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  business_name: { type: String, default: "Bulb And Key Project", lowercase: true },
  //business_name 
  logo: { type: String, default: "NA", lowercase: true },
  //NA means Still not assigned.
  about: { type: String, default: null },
  //image link provide for refrence in making configurable project
  email: { type: String, default: "testshah@bulbandkey.com" },
  //quatity means no of same projet you want to create from creator
  phone_no: { type: Number, default: 9876543210 },
  //some configurable options
  alternate_contacts: { type: Object, default: null },
  //expected delivery date
  bank_details: { type: Object, default: null },
  //location where they ordered.
  country_code: { type: String, default: null },
  //location where they ordered.
  firstname: { type: String, default: "test", lowercase: true },
  //First Name 
  lastname: { type: String, default: "shah", lowercase: true },
  //last Name 
  address: { type: Object, default: null },
  //some configurable options
  city: { type: String, default: "Bulb And Key Address", lowercase: true },
  //city in address  
  latitude: { type: Number, default: null },
  //latitude of specific location
  longitude: { type: Number, default: null },
  //longitude of specific location
  pincode: { type: Number, default: null },
  //pincode of location
  user_id: { type: Number, default: 0 },
  //user id of person who create a project
  is_active: { type: Boolean, default: false },
  //is this project is active or not.
  url_key: { type: String, default: -1 },
  //url_key for specific purpose.
  review_count: { type: Number, default: -1 },
  //review count for creator(-1 means not set till now)
  photo_count: { type: Number, default: -1 },
  //photo_count for creator(-1 means not set till now)
  score: { type: Number, default: -1 },
  //score (-1 means not set till now)
  average_rating: { type: Number, default: -1 },
  //average_rating of creator (-1 means not set till now)
  website: { type: String, default: null },
  //website
  social_links: { type: String, default: null },
  //social_links of creators
  serving_radius: { type: String, default: null },
  //serving radius of creator
  tagline: { type: String, default: null },
  //tag line of creator
  lead_time: { type: String, default: null },
  //lead time of creator
  take_order: { type: Boolean, default: false },
  //take order 
  take_order_till: { type: Date, default: Date.now() },
  //
  max_order_nos: { type: Number, default: -1 },
  //
  categories: { type: Number, default: -1 },
  //it is connection with another models
  created_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  updated_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  context: { type: Object, default: null },
  //json object for future back hand purpose.
  status: { type: Boolean, default: 0 },
  //
  is_deleted: { type: Boolean, default: false },
  //
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


Schema.virtual('creator_user_data', { ref: 'User', localField: 'user_id', foreignField: 'user_id', justOne: true })

Schema.virtual('user_active', { ref: 'User', localField: 'project_id', foreignField: 'user_id', justOne: true });

//Add New Config here



Schema.set('collection', 'Creator');
Schema.pre('save', function (next) {
  utilityService.updateDateWhenChangeHappen(this);
  next();
});
const model = mongoose.model('Creator', Schema);

module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.