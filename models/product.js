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

const userSchema = new Schema({


    name: { type: String, required: true, minlength: 1, maxlength: 50, trim: true 

    },

    price: { type: Number, required: true, minlength: 1, maxlength: 50, trim: true, 
		set: price =>  { return (Math.round(price * 100) / 100).toFixed(2);
		}

    },

    description: { type: String, minlength: 1, maxlength: 250, trim: true}
});

const Product = new mongoose.model('product', userSchema);
module.exports = Product;