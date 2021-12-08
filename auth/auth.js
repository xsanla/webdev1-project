
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

	//check if auth header empty
	const authHeader = request.headers.authorization;
	if(authHeader === null || authHeader === undefined || authHeader === ''){
		return null;
	}

	// check if authheader type is basic
    if(authHeader.split(' ')[0] !="Basic")
	{
		return null;
	}

	const arrayCredentials = requestUtils.getCredentials(request);
	
	const emailUser = arrayCredentials[0];
	const passwordUser = arrayCredentials[1]; 
	
	
	if (arrayCredentials) {

		const user = await User.findOne({email: emailUser}).exec();
	
		if (user){
		
		return await user.checkPassword(passwordUser)? user : null;
		}
	}
	return null; 
	};

	module.exports = { getCurrentUser };