
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;


var Schema = new mongoose.Schema({
  project_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  name: { type: String, default: "Bulb And Key Project", lowercase: true },
  //Name 
  type: { type: String, default: "NA", lowercase: true },
  //NA means Still not assigned.
  imagelink: { type: String, default: null },
  //image link provide for refrence in making configurable project
  quantity: { type: Number, default: 0 },
  //quatity means no of same projet you want to create from creator
  options: { type: Object, default: null },
  //some configurable options
  expected_date: { type: Date, default: null },
  //expected delivery date
  location: { type: String, default: null },
  //location where they ordered.
  latitude: { type: Number, default: null },
  //latitude of specific location
  longitude: { type: Number, default: null },
  //longitude of specific location
  pincode: { type: Number, default: null },
  //pincode of location
  product_id: { type: Number, default: 0 },
  //productid based on which type of product it is.
  user_id: { type: Number, ref: 'Users' },
  //user id of person who create a project
  is_active: { type: Boolean, default: false },
  //is this project is active or not.
  is_show_case_allow: { type: Boolean, default: false },
  //is show case is allow on main page
  lowestquote: { type: Number, default: -1 },
  //lowest quote for project(-1 means not set till now)
  averagequote: { type: Number, default: -1 },
  //average quote for project(-1 means not set till now)
  highestquote: { type: Number, default: -1 },
  //highest quote for project(-1 means not set till now)
  winner: { type: Number, default: -1 },
  //idetification which creator is win this project(-1 means not set till now)
  TakeOrder: { type: Boolean, default: false },
  //bit which defined project is take order or not.
  created_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  updated_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  context: { type: Object, default: null },
  //json object for future back hand purpose.
  status: { type: String, default: 0 },
  //status of project it can possible any thing.(0 means it is created.)
  is_deleted: { type: Boolean, default: false },
  //project is deleted or not.
  images_links: { type: String, default: null },
  //other support links of image
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

//delete from here.

//Add New Config here

//delete till here


Schema.set('collection', 'Project');
Schema.pre('save', function(next) {
  utilityService.updateDateWhenChangeHappen(this);
  next();
});
const model = mongoose.model('Project', Schema);

// UserSchema.set('collection', 'User');
// const usermodel = mongoose.model('User', UserSchema);

module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.