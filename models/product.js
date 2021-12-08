const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA_DEFAULTS = {
    name: {
      minLength: 1,
      maxLength: 50
    },

};

const productSchema = new Schema({


    name: { type: String, required: true, minlength: 1, maxlength: 50, trim: true 

    },

    price: { type: Number, required: true, minlength: 1, maxlength: 50, trim: true, 
		set: price =>  { return (Math.round(price * 100) / 100).toFixed(2);
		}
    },

    image:{ type: String},

    description: { type: String, minlength: 1, maxlength: 250, trim: true}
});

productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('product', productSchema);
module.exports = Product;