
const requestUtils = require('../utils/requestUtils');
const User = require('../models/user');
//const users = require('../utils/users');

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {  
  // TODO: 8.5 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

   //throw new Error('Not Implemented');   

  const arrayCredentials = requestUtils.getCredentials(request);
  
  const emailUser = arrayCredentials[0];
  const passwordUser = arrayCredentials[1]; 
  
  
  if (arrayCredentials) {

  const user = await User.findOne({email: emailUser}).exec();
  
    if (user){
    
    return await user.checkPassword(passwordUser)? user : null;
    }
  }
  return arrayCredentials; 
};

module.exports = { getCurrentUser };