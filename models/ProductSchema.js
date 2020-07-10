const mongoose = require('mongoose');

//creating refrence userSchema to user collection
const Schema = mongoose.Schema;
 //creating productSchema
 const productSchema = new Schema({
    product_id:Schema.Types.ObjectId,
    producttype:{
      type:String,
      enum:['Notebook','Pen']
    },
    brand:{
      type:String,
      enum:['Classmate','Ajanata','Cello','Glycer']
    },
    color:{
      type:String,
      enum:['red','blue','black']//for pen category
    },
    size:{
      type:String,
      enum:['small','medium','large']//for book category
    },
    description:{
      type:String
    },
    availability:Boolean,
    price:Number,
    addedAt:Date
    
 });

module.exports = mongoose.model('Products',productSchema);