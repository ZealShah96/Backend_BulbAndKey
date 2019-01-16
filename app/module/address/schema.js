
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;


var Schema = new mongoose.Schema({
  address_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  user_id: { type: Number,default:0},
  //user id of person who create a Address
  flat_no: { type: String, default: "Bulb And Key Address", lowercase: true },
  //flat no in address  
  street: { type: String, default: "Bulb And Key Address", lowercase: true },
  //street in address  
  area: { type: String, default: "Bulb And Key Address", lowercase: true },
  //area in address  
  city: { type: String, default: "Bulb And Key Address", lowercase: true },
  //city in address  
  area: { type: String, default: "Bulb And Key Address", lowercase: true },
  //area in address  
  state: { type: String, default: "Bulb And Key Address", lowercase: true },
  //state in address  
  landmark: { type: String, default: "NA", lowercase: true },
  //landmark in address  
  pincode: { type: Number, default: null },
  //pincode of location
  is_active: { type: Boolean, default: false },
  //is this address is active or not.
  created_date: { type: Date,default: Date.now() },
  //created date when this Address generated.
  updated_date: { type: Date, default: Date.now() },
  //created date when this Address generated.
  context: { type: Object, default: null },
  //json object for future back hand purpose.
  is_deleted: { type: Boolean, default: false },
  //Address is deleted or not.
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
Schema.set('collection', 'Address');
const model = mongoose.model('Address', Schema);

module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.