const mongoose = require('mongoose');

//creating refrence userSchema to user collection
var Schema = mongoose.Schema;
 //creating order schema
 var orderSchema = new Schema({
    order_id:Schema.Types.ObjectId,
    user_id:{
      type:Schema.Types.ObjectId,
      ref:'Users'
    },
    product_id:{
      type:Schema.Types.ObjectId,
      ref:'Products'
    },
    quantity:Number,
    status:{
      type:String,
      enum:['placed','shipped','delievered','cancelled']
    },
    orderAt:Date
    
  });

module.exports = mongoose.model('Orders',orderSchema);