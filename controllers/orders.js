const responseUtils = require('../utils/responseUtils');
const Order = require('../models/order');

/**
 * Send all ordered products in the system as json 
 * @param {http message} response http response to be sent out
 * @returns promise that resolves to sending json in the response body with the code 200
 */
const getOrdersAdmin = async response => {

    const orders = await Order.find({}); 
    return await responseUtils.sendJson(response, orders, 200);   
};

/**
 * Send the order data of a specific order. Requires admin credentials and hence,
 * any order is accessible
 * @param {http message} response http response to be sent out
 * @param {object} orderId the id of the requested order
 * @returns promise that resolves to sending json in the response body with the http code 200
 */
const getSingleOrderAdmin = async (response, orderId) => {
	const order = await Order.findOne({_id: orderId}).exec();
	if(order == null){
		return await responseUtils.notFound(response);
	}
	return await responseUtils.sendJson(response, order, 200);
}

/**
 * Send the order data of a specific order. Customer credentials are required to call this
 * function. Only customers own orders can be viewed
 * @param {http message} response http response to be sent out
 * @param {object} orderId the id of the requested order
 * @param {object} customerId the id of the customer requesting the order data
 * @returns promise that resolves to sending json if the order exists and customer has cre
 * dentials to it || resolves to not found response if customer doesn't have credentials or
 * the order doesn't exist
 */
const getSingleOrderCustomer = async (response, orderId, customerId) => {
	const order = await Order.findOne({_id: orderId, customerId: customerId}).exec();
	if(order == null){
		return await responseUtils.notFound(response);
	}
	return await responseUtils.sendJson(response, order, 200);
}

/**
 * Gets all orders of the logged in customer user
 * @param {http message} response http response to be sent out
 * @param {object} customerId the id of the logged in customer 
 * @returns the orders of the current user as json
 */
const getOrdersCustomer = async (response, customerId) => {
	const orders = await Order.find({customerId: customerId}).exec(); 
    return await responseUtils.sendJson(response, orders, 200);   
}

/**
 * creates an order into the database
 * @param {http message} response http response to be sent out 
 * @param {object} orderData the data needed for the creation of the order
 * @param {object} customerId the object id of the customer creating the order 
 * @returns badRequest if order data is incomplete and the response with the newly created order 
 * as the response body.
 */
const createOrder = async (response, orderData, customerId) => {

	if(Object.keys(orderData.items).length === 0){
		return await responseUtils.badRequest(response, "Items cannot be empty!");
	}

	// check if order data has all the properties needed for creating an order
	for(var item of orderData.items){

		if(item.quantity == null || item.product == null){
			return await responseUtils.badRequest(response, "quantity or product cant be empty");
		}
		if(item.product._id == null || item.product.name == null || item.product.price == null){
			return await responseUtils.badRequest(response, "productId, name or price can't be empty");
		}
	}	
	//Creating an order
	const newOrder = new Order(orderData);
	newOrder.customerId = customerId;
	await newOrder.save();
	return await responseUtils.sendJson(response, newOrder, 201);
};




 
 
 module.exports = {getOrdersAdmin, createOrder, getOrdersCustomer, getSingleOrderAdmin, getSingleOrderCustomer};