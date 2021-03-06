const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson, getCredentials } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { emailInUse, getAllUsers, saveNewUser, validateUser, deleteUserById, updateUserRole, getUserById} = require('./utils/users');
const { getCurrentUser } = require('./auth/auth');
const controlUser = require('./controllers/users.js');
const controlProduct = require('./controllers/products.js');
const controlOrder = require('./controllers/orders.js');
const User = require('./models/user');
/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET', 'POST'],
  '/api/orders': ['GET', 'POST']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response the response sent 
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
 * @param {string} prefix the specified par of the api
 * @returns {boolean} boolean value representing if the url has an id component
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
 * @returns {boolean} boolean value representing if url matches the format mentioned
 * above
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};
/**
 * Does the URL match /api/products/{id}
 * @param {string} url filePath
 * @returns {boolean} boolean value representing if url matches the format mentioned
 * above
 */
const matchProductId =  url => {
	return matchIdRoute(url, 'products');
};
/**
 * Does the URL match /api/orders/{id}
 * @param {string} url filePath
 * @returns {boolean} boolean value representing if url matches the format mentioned
 * above
 */
 const matchOrdertId =  url => {
	return matchIdRoute(url, 'orders');
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

    const authHeader = request.headers.authorization;
    if(authHeader === null || authHeader === undefined){
      return await responseUtils.basicAuthChallenge(response);
    }

	if (!acceptsJson(request)) {
		return responseUtils.contentTypeNotAcceptable(response);
	}

    const user = await getCurrentUser(request);  
    const id = filePath.split("/")[3];

   if (method.toUpperCase() === 'GET') {
        // view a single user
        //const data = await getCurrentUser(request);  
        
        if (user === null || user === undefined) {   
          return await responseUtils.basicAuthChallenge(response);        
        } 
          
    	if (user.role.toUpperCase() === 'CUSTOMER') {
    		return await responseUtils.forbidden(response);  
    	} 

        if (user.role.toUpperCase()=== 'ADMIN') {
			
        	return await controlUser.viewUser(response, id, user);
      	}  
       
    } 
    
    // PUT == update the existing user in the filePath with the user requested
     if (method.toUpperCase() === 'PUT') {
          // update user   
         
        if (user === null || user === undefined) { 
          return await responseUtils.basicAuthChallenge(response);         
        } 
         
        if (user.role.toUpperCase() === 'CUSTOMER') {
			return await responseUtils.forbidden(response);  
		}

        if (user.role.toUpperCase()=== 'ADMIN') {             
			const body = await parseBodyJson(request);
			return await controlUser.updateUser(response, id, user, body);
      	}        
    }


    if (method.toUpperCase() === 'DELETE') {

    	if (user === null || user === undefined) { 
        	return await responseUtils.basicAuthChallenge(response);            
        } 
       
        if (user.role.toUpperCase() === 'CUSTOMER') {
        	return await responseUtils.forbidden(response);  
        } 
      
        if (user.role.toUpperCase()=== 'ADMIN') {
			return await controlUser.deleteUser(response, id, user);
		}            
    }
}



	
	if (matchProductId(filePath)){
		//check if auth header empty
		const authHeader = request.headers.authorization;
		if(authHeader === null || authHeader === undefined || authHeader === ''){
			return await responseUtils.basicAuthChallenge(response);
		}

		// Require a correct accept header (require 'application/json' or '*/*')
		if (!acceptsJson(request)) {
			return responseUtils.contentTypeNotAcceptable(response);
		}   
		
		// check if auth header properly encoded
		var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
		if(!base64regex.test(authHeader.split(' ')[1])){
			return await responseUtils.basicAuthChallenge(response);
		}
		const requestSender = await getCurrentUser(request);  


		if (requestSender === null || requestSender === undefined) { 
		return await responseUtils.basicAuthChallenge(response);           
		}
		
		const id = filePath.split("/")[3];
		// getting a single product
		if(method.toUpperCase() === 'GET'){
			if (requestSender.role.toUpperCase() === 'CUSTOMER' ||requestSender.role.toUpperCase()=== 'ADMIN') {
				return await controlProduct.getSingleProduct(response, id);
			}
		}

		if(method.toUpperCase() === 'PUT'){
			if(requestSender.role.toUpperCase() === 'CUSTOMER') {
				return await responseUtils.forbidden(response);
			}

			if(requestSender.role.toUpperCase() === 'ADMIN'){
				const productJson = await parseBodyJson(request);
				return await controlProduct.updateProduct(response, productJson, id);
			}
		}

		if(method.toUpperCase() === 'DELETE'){
			if(requestSender.role.toUpperCase() === 'CUSTOMER') {
				return await responseUtils.forbidden(response);
			}

			if(requestSender.role.toUpperCase() === 'ADMIN'){
				return await controlProduct.deleteProduct(response, id);
			}
		}
	}

	// Get order by order id
	if(matchOrdertId(filePath)){
		//check if auth header empty
		const authHeader = request.headers.authorization;
		if(authHeader === null || authHeader === undefined || authHeader === ''){
			return await responseUtils.basicAuthChallenge(response);
		}

		// Require a correct accept header (require 'application/json' or '*/*')
		if (!acceptsJson(request)) {
			return responseUtils.contentTypeNotAcceptable(response);
		}   
		
		// check if auth header properly encoded
		var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
		if(!base64regex.test(authHeader.split(' ')[1])){
			return await responseUtils.basicAuthChallenge(response);
		}
		const requestSender = await getCurrentUser(request);  


		if (requestSender === null || requestSender === undefined) { 
		return await responseUtils.basicAuthChallenge(response);           
		}
		
		const orderId = filePath.split("/")[3];
		if(requestSender.role.toUpperCase() === 'ADMIN'){
			await controlOrder.getSingleOrderAdmin(response, orderId);
		}

		if(requestSender.role.toUpperCase() === 'CUSTOMER'){
			await controlOrder.getSingleOrderCustomer(response, orderId, requestSender._id);
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

		// check if auth header empty    
		const authHeader = request.headers.authorization;
		if(authHeader === null || authHeader === undefined || authHeader === ''){
			return await responseUtils.basicAuthChallenge(response);
		}
		// check if auth header properly encoded
		var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
		if(!base64regex.test(authHeader.split(' ')[1]))
		{
			return await responseUtils.basicAuthChallenge(response);
		}
		// get the current user
		const data = await getCurrentUser(request); 
		if (data === null || data === undefined) { 
			return await responseUtils.basicAuthChallenge(response);  
		}  
		// if user role is customer   
		if (data.role.toUpperCase() === 'CUSTOMER') { 
			return await responseUtils.forbidden(response);  
		} 
		if (data.role.toUpperCase() === 'ADMIN') {
			await controlUser.getAllUsers(response);
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
	
	await controlUser.registerUser(response, userJson);
  }



  // getting all products
  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {

	//check if auth header empty
	const authHeader = request.headers.authorization;
        if(authHeader === null || authHeader === undefined || authHeader === ''){
          return await responseUtils.basicAuthChallenge(response);
        }

	// check if auth header properly encoded
	var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if(!base64regex.test(authHeader.split(' ')[1]))
	{
		return await responseUtils.basicAuthChallenge(response);
	}
    const requestSender = await getCurrentUser(request);  
    

    if (requestSender === null || requestSender === undefined) { 
      return await responseUtils.basicAuthChallenge(response);           
    } 

	
    if (requestSender.role.toUpperCase() === 'CUSTOMER' ||requestSender.role.toUpperCase()=== 'ADMIN') {
		await controlProduct.getAllProducts(response);
    }
  }

  // Creating a new product
  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {

	//check if auth header empty
	const authHeader = request.headers.authorization;
        if(authHeader === null || authHeader === undefined || authHeader === ''){
          return await responseUtils.basicAuthChallenge(response);
        }
	// check if auth header properly encoded
	var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if(!base64regex.test(authHeader.split(' ')[1]))
	{
		return await responseUtils.basicAuthChallenge(response);
	}
    const requestSender = await getCurrentUser(request);  
    
    if (requestSender === null || requestSender === undefined) { 
      return await responseUtils.basicAuthChallenge(response);           
    } 
	
	if (!isJson(request)) {
		return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
	}
	const productJson = await parseBodyJson(request);

	
	if (requestSender.role.toUpperCase() === 'CUSTOMER') {
		return await responseUtils.forbidden(response);  
	}
    if (requestSender.role.toUpperCase()=== 'ADMIN') {
		await controlProduct.addProduct(response, productJson);
    }
  }

  //Getting all orders
  if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {

	//check if auth header empty
	const authHeader = request.headers.authorization;
        if(authHeader === null || authHeader === undefined || authHeader === ''){
          return await responseUtils.basicAuthChallenge(response);
        }

	// check if auth header properly encoded
	var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if(!base64regex.test(authHeader.split(' ')[1]))
	{
		return await responseUtils.basicAuthChallenge(response);
	}
    const requestSender = await getCurrentUser(request);  
    

    if (requestSender === null || requestSender === undefined) { 
      return await responseUtils.basicAuthChallenge(response);           
    } 

    if (requestSender.role.toUpperCase()=== 'ADMIN') {
		await controlOrder.getOrdersAdmin(response);
    }

	if (requestSender.role.toUpperCase()=== 'CUSTOMER') {
		await controlOrder.getOrdersCustomer(response, requestSender._id);
    }
  }

  // Create a new order
  if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {

	//check if auth header empty
	const authHeader = request.headers.authorization;
    if(authHeader === null || authHeader === undefined || authHeader === ''){
      return await responseUtils.basicAuthChallenge(response);
    }
	if (!isJson(request)) {
		return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
	}
	// check if auth header properly encoded
	var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if(!base64regex.test(authHeader.split(' ')[1]))
	{
		return await responseUtils.basicAuthChallenge(response);
	}
    const requestSender = await getCurrentUser(request);  
    

    if (requestSender === null || requestSender === undefined) { 
      return await responseUtils.basicAuthChallenge(response);           
    } 

    if (requestSender.role.toUpperCase()=== 'ADMIN') {
		return await responseUtils.forbidden(response);
    }

	if(requestSender.role.toUpperCase()=== 'CUSTOMER'){
		const orderData = await parseBodyJson(request);
		await controlOrder.createOrder(response, orderData, requestSender._id);
	}
  }
  
};

module.exports = { handleRequest };