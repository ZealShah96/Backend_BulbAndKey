
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//const Schema        = mongoose.Schema;
const utilityService = require('./../../service/utilityservice');
const dataService = require('./../../service/DataService');

var Schema = new mongoose.Schema({
  user_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  firstname: { type: String, default: "test", lowercase: true },
  //First Name 
  lastname: { type: String, default: "shah", lowercase: true },
  //last Name 
  phone_no: { type: String, require: true, default: Date.now().toString().substring(0, 10), required: true },
  //phone no of user which most important column in collection
  country_code: { type: String, default: "+91", required: true },
  //contry code 
  email: { type: String, default: "bulbandkey@gmail.com", lowercase: true, trim: true },
  //email id of user
  password: { type: String, default: "bulbandkey1996@", required: true },
  //password 
  avatar: { type: String, default: null },
  //put link of avatar 
  otp: { type: Number, default: -1 },
  //Otp for user
  otp_expiry: { type: Date, default: utilityService.addMinInTodayDate(5) },
  //otp expiry date
  is_creator: { type: Number, default: false },
  //use is creator
  is_active: { type: Boolean, default: false },
  //is this project is active or not.
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
},
  // schema options: Don't forget this option
  // if you declare foreign keys for this schema afterwards.
  {
    toObject: { virtuals: true },
    // use if your results might be retrieved as JSON
    // see http://stackoverflow.com/q/13133911/488666
    toJSON: { virtuals: true }
  });


        Schema.virtual('creator_details', {   ref: 'Creator',   localField: 'user_id',   foreignField: 'user_id'});     

        Schema.virtual('projects_details', {   ref: 'Project',   localField: 'user_id',   foreignField: 'user_id'});

         Schema.virtual('users_address', {  ref: 'Address',  localField: 'user_id',  foreignField: 'user_id'});
         //Add New Config here

Schema.set('collection', 'User');
Schema.pre('save', async function (next) {
  try {
    await utilityService.hashPassword(this);
    utilityService.updateDateWhenChangeHappen(this);

    next();
  }
  catch (error) {
    throw error;
  }

});


Schema.pre('update', async function () {
  this.update({}, { $set: { password: await utilityService.hashPassword(this.password) } });
  utilityService.log(this);
});
//const model = mongoose.model('User', Schema);

// module.exports = {
//   Model: model
// }

//Done.