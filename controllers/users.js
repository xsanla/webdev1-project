const User = require('../models/user');
const responseUtils = require('../utils/responseUtils');
/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllUsers = async response => {
  


   // if user role is admin  
  
    const users = await User.find({}); 
  return await responseUtils.sendJson(response, users, 200);   
 
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const deleteUser = async(response, userId, currentUser) => {
	if(userId == currentUser._id){
		return await responseUtils.badRequest(response);
	}
	const deletedUser = await User.findOneAndDelete({_id: userId}).exec();
	if(deletedUser){
		return await responseUtils.sendJson(response, deletedUser, 200);	
	}
	return await responseUtils.notFound(response);
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 * @param {Object} userData JSON data from request body
 */
const updateUser = async(response, userId, currentUser, userData) => {
	
    if(userId == currentUser._id){
		return await responseUtils.badRequest(response);
	}     
    
	if (userData.role && (userData.role==='admin' || userData.role==='customer'))
	{  
	  const userToUpdate = await User.findById(userId).exec();
	  userToUpdate.role = userData.role;
	  await userToUpdate.save();
	  return await responseUtils.sendJson(response, userToUpdate, 200);
	} else {
	  return responseUtils.badRequest(response, 'Role is missing');         
	}              
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const viewUser = async(response, userId, currentUser) => {
	const userToFind = await User.findOne({_id: userId}).exec();
	return await responseUtils.sendJson(response, userToFind, 200);
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const registerUser = async(response, userData) => {
	const pword = userData.password;
	const userEmail = userData.email;
	const userName = userData.name;
	const userCheck = await User.findOne({email: userEmail}).exec();
    if(userCheck || userName == null || userEmail == null || pword == null)
    {
      return await responseUtils.badRequest(response, "400 Bad Request");
    } 
    userData.role = 'customer';
    
	const newUser = new User(userData);
	await newUser.save();
    response.writeHead(201, "201 Created");
    return await responseUtils.sendJson(response, newUser, 201);
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };