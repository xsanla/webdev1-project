const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const orderItemSchema = new Schema({

  product: { 
      _id: { type : String, required: true},
      name: { type : String, required: true},
      price: { type: Number, required: true, min:0},
      description: {type : String}
  },
  
  quantity: { type: Number, min: 1
  }


});
const orderSchema = new Schema({


    customerId: { type: String, required: true
    },

    
    items: {type : [orderItemSchema], required: true, minItems: 1
    }
});


orderSchema.set('toJSON', { virtuals: false, versionKey: false });
const OrderItem = new mongoose.model('orderItem', orderItemSchema);
const Order = new mongoose.model('order', orderSchema);
module.exports = Order;