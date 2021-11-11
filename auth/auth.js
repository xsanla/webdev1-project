
const requestUtils = require('../utils/requestUtils');
const users = require('../utils/users');

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {   // I took away async from request 
  // TODO: 8.5 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

   //throw new Error('Not Implemented');   

  const arrayCredentials = requestUtils.getCredentials(request);
  //console.log(arrayCredentials);
  if (arrayCredentials!=null) {
  const email = arrayCredentials[0];
  const password = arrayCredentials[1]; 
  //console.log(users.getUser(email, password));
  return await users.getUser(email, password);   

  } else {    
    return arrayCredentials; 
  }
 
};

module.exports = { getCurrentUser };