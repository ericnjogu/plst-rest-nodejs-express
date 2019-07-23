const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = {
  title:{type:String},
  author:{type:String},
  genre:{type:String},
  read:{type:Boolean, default:false},
};

const book = new Schema (
  schema
);

module.exports = {instance: mongoose.model('Book', book), schema}
