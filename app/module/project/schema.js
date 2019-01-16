
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;
const utilityService = require('./../../service/utilityservice');

let Schema = new mongoose.Schema({
  project_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  name: { type: String, default: "Bulb And Key Project", lowercase: true },
  //Name 
  is_active: { type: Boolean, default: false },
  //is this project is active or not.
  TakeOrder: { type: Boolean, default: false },
  //bit which defined project is take order or not.
  status: { type: String, default: null },
  //status of project it can possible any thing.(0 means it is created.)
  quantity: { type: Number, default: 0 },
  //quatity means no of same projet you want to create from creator
  type: { type: String, default: "NA", lowercase: true },
  //NA means Still not assigned.
  imagelink: { type: String, default: null },
  //image link provide for refrence in making configurable project
  options: { type: Object, default: null },
  //some configurable options
  expected_date: { type: Date, default: null },
  //expected delivery date
  created_date: { type: Date, default: Date.now() },
  //created date when this project generated.
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
  user_id: { type: Number ,ref :'User' },
  //user id of person who create a project
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
  updated_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  context: { type: Object, default: null },
  //json object for future back hand purpose.
  is_deleted: { type: Boolean, default: false },
  //project is deleted or not.
  images_links: { type:Array, default:[]},
  //other support links of image
},
  // schema options: Don't forget this option
  // if you declare foreign keys for this schema afterwards.
  {
    toObject: { virtuals: true ,getters:true},
    // use if your results might be retrieved as JSON
    // see http://stackoverflow.com/q/13133911/488666
    toJSON: { virtuals: true,getters:true}
  });
// Foreign keys definitions


//  Schema.virtual('winner_details', {  ref: 'Creator',  localField: 'winner',  foreignField: 'creator_id',  justOne: true });
 Schema.virtual('user_details', {  ref: 'User',  localField: 'user_id',  foreignField: 'user_id' });
//  Schema.virtual('user_active', {  ref: 'User',  localField: 'project_id',  foreignField: 'user_id',justOne: true});
//  Schema.virtual('user_details', {  ref: 'User',  localField: 'user_id',  foreignField: 'user_id',  justOne: true });Schema.virtual('user_active', {  ref: 'User',  localField: 'project_id',  foreignField: 'user_id',  justOne: true });Schema.virtual('users_address', {  ref: 'Address',  localField: 'user_id',  foreignField: 'user_id',  justOne: true });
   //Add New Config here
         
         
         

Schema.set('collection', 'Project');
Schema.pre('save', function (next) {
  utilityService.updateDateWhenChangeHappen(this);
  next();
});
const model = mongoose.model('Project', Schema);

module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.