const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// You can use SALT_ROUNDS when hashing the password with bcrypt.hashSync()
const SALT_ROUNDS = 10;

// You can use these SCHEMA_DEFAULTS when setting the validators for the User Schema. For example the default role can be accessed with SCHEMA_DEFAULTS.role.defaultValue
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

// TODO: 9.5 Implement the userSchema
const userSchema = new Schema({
  // for 'name' 
  // set type
  // and the following validators:
  // required, trim, minlength, maxlength 
  name: {

  },
  // for 'email'
  // set type
  // and the following validators:
  // required, unique, trim, match
  // NOTE: unique is not a validator (see mongoose documentation)
  // TIP: with match validator default value for email can be used and
  // for checking the email you can use the match() from SCHEMA_DEFAULTS

  //       
  email: {

  },
  // for 'password'
  // set type
  // and the following validators:
  // required, minlength
  // for inspiration for the setter function, see the following comment lines
  // set: password => {
  //   if (ENTER CONDITIONS WHERE THE PASSWORD IS NOT VALID) return password;
  //   return bcrypt.hashSync(ENTER PARAMETERS);
  // }
  // 
  password: {

  },
  // for 'role'
  // set type
  // and the following validators:
  //  required, trim, lowercase, enum,    default
  role: {

  }
});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function(password) {
  // TODO: 9.5 Implement this
  // Here you should return the result you get from bcrypt.compare() function. Remember to await! :-)
  // In this method you can just do a one-liner:
  //   which returns the results of
  //    - use BCrypt's compare() function. For its paramteres give:
  //      - password as given as parameter to the call to this method
  //      - the password of the user from the User model (this.password)[(this is one of the few places where we need to use 'this'].

};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;