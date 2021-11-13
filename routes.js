const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { emailInUse, getAllUsers, saveNewUser, validateUser, deleteUserById, updateUserRole, getUserById} = require('./utils/users');
const { getCurrentUser } = require('./auth/auth');
const utils = require('./public/js/utils.js');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix
 * @returns {boolean}
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.6 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    //throw new Error('Not Implemented');
    //const userCredentials =  getCredentials(request);
    const id = filePath.split("/")[3];
    const requestSender = await getCurrentUser(request);  
    const userData = getUserById(id);

   if (method.toUpperCase() === 'GET') {
        // view a single user
        //const data = await getCurrentUser(request);   

       if (requestSender === null || requestSender === undefined ) { 
          
          return await responseUtils.basicAuthChallenge(response);        
          
       } 

       if (userData == null) {
        return await responseUtils.notFound(response);
    } 

    if (requestSender.role.toUpperCase() === 'CUSTOMER') {


      return await responseUtils.forbidden(response);  
    } 

        if (requestSender.role.toUpperCase()=== 'ADMIN') {
        return await responseUtils.sendJson(response, userData, 200);
          
      }  
       
      } 
    
    // PUT == update the existing user in the filePath with the user requested
     if (method.toUpperCase() === 'PUT') {
          // update user   
         
          if (requestSender === null || requestSender === undefined) { 
            return await responseUtils.basicAuthChallenge(response);         
          } 
         if (userData == null) {
          return await responseUtils.notFound(response);
      } 
            
      if (requestSender.role.toUpperCase()=== 'ADMIN') {             
          const body = await parseBodyJson(request);
          
                       
          if (body.role && (body.role==='admin' || body.role==='customer'))
          {
            userData.role = body.role;
            return await responseUtils.sendJson(response, userData, 200);
          } else {
            return responseUtils.badRequest(response, 'Role is missing');         
           }         
                 
      }       
   
        if (requestSender.role.toUpperCase() === 'CUSTOMER') {
          return await responseUtils.forbidden(response);  
        }        
        
      }

      if (method.toUpperCase() === 'DELETE') {

        if (requestSender === null || requestSender === undefined) { 

          return await responseUtils.basicAuthChallenge(response);         
          
       } 
       if (userData == null) {
        return await responseUtils.notFound(response);
    } 
       
       if (requestSender.role.toUpperCase() === 'CUSTOMER') {

        return await responseUtils.forbidden(response);  
      } 
      
      if (requestSender.role.toUpperCase()=== 'ADMIN') {

        deleteUserById(id);
                              
        return await responseUtils.sendJson(response, userData, 200);
    }     
          
    }
  }


  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }       

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }   

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    // TODO 8.4 Replace the current code in this function.
    // First call getAllUsers() function to fetch the list of users.
    // Then you can use the sendJson(response, payload, code = 200) from 
    // ./utils/responseUtils.js to send the response in JSON format.
    //
    //const users = await getAllUsers(response);
    //responseUtils.sendJson(response, users, code = 200);
 // TODO: 8.5 Add authentication (only allowed to users with role "admin")

// returns null, undefined or obj     
const data = await getCurrentUser(request); 
 if (data === null || data === undefined) { 
    return await responseUtils.basicAuthChallenge(response);  
 }  
  // if user role is customer   
 if (data.role.toUpperCase() === 'CUSTOMER') { 
   return await responseUtils.forbidden(response);  
  } 
   // if user role is admin  
  if (data.role.toUpperCase() === 'ADMIN') { 
    const users = getAllUsers(response);    
  return await responseUtils.sendJson(response, users, 200);   
 }  

} 

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    
    // TODO: 8.4 Implement registration
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.
    // 
    const userJson = await parseBodyJson(request);
    if(emailInUse(userJson.email) || validateUser(userJson).length !== 0)
    {
      return responseUtils.badRequest(response, "400 Bad Request");
    } 
    userJson.role = 'customer';
    const createdUser = await saveNewUser(userJson);
    response.writeHead(201, "201 Created");
    return responseUtils.sendJson(response, createdUser, 201);
  }
};

module.exports = { handleRequest };