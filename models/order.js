const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA_DEFAULTS = {
    name: {
      minLength: 1,
      maxLength: 50
    },
    email: {
      // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
      minLength: 10
    },
    role: {
      values: ['admin', 'customer'],
      defaultValue: 'customer'
    }
};

const orderItemSchema = new Schema({

  product: { 
      _id: { type : String, required: true},
      name: { type : String, required: true},
      price: { type: Number, required: true, min:0},
      description: {type : String}
  },
  
  quantity: { type: Number, min: 0 
  }


});
const orderSchema = new Schema({


    customerId: { type: String, required: true
    },

    
    items: {type : [orderItemSchema], required: true, minItems: 1
    }
});



const OrderItem = new mongoose.model('orderItem', orderItemSchema);
const Order = new mongoose.model('order', orderSchema);
module.exports = Order;