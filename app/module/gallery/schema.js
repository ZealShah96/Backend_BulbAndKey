
const mongoose = require('mongoose');
//const Schema        = mongoose.Schema;


var Schema = new mongoose.Schema({
  gallery_id: { type: Number, default: 0, required: true, index: true },
  //primary key in this schema
  image_link: { type: String, default: "Bulb And Key Project", lowercase: true },
  //Name 
  caption: { type: String, default: "NA", lowercase: true },
  //NA means Still not assigned.
  creator_id: { type: Number, default: 0 },
  //primary key in this schema
  tags: { type: Object, default: null },
  //tags of image 
  created_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  updated_date: { type: Date, default: Date.now() },
  //created date when this project generated.
  context: { type: Object, default: null },
  //json object for future back hand purpose.
  is_deleted: { type: Boolean, default: false },
  //image is deleted or not.
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

Schema.set('collection', 'gallary');
Schema.pre('save', function(next) {
  utilityService.updateDateWhenChangeHappen(this);
  next();
});
const model = mongoose.model('gallary', Schema);

module.exports = {
  Model: model,
  // usermodel:usermodel
}

//Done.