const responseUtils = require('../utils/responseUtils');
const Order = require('../models/order');

/**
 * Send all ordered products as json
 *
 * @param {http.ServerResponse} response
 */
const getOrderAdmin = async response => {

    const orders = await Order.find({}); 
    return await responseUtils.sendJson(response, orders, 200);   
};
const getOrderCustomer = async (response, customerId) => {
	const orders = await Order.find({customerId: customerId}).exec(); 
    return await responseUtils.sendJson(response, orders, 200);   
}

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




 
 
 module.exports = {getOrderAdmin, createOrder, getOrderCustomer};