const responseUtils = require('../utils/responseUtils');
const Product = require('../models/product');
/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllProducts = async response => {
  	const data = await Product.find({});

  	return await responseUtils.sendJson(response, data, 200);
};
/**
 * 
 * @param {*} response 
 * @param {*} productData 
 */
const addProduct = async (response, productData) => {
	if(productData.price == null || productData.name == null)
	{
		return await responseUtils.badRequest(response, "400 Bad Request");
	}
	
	const newProduct = new Product(productData);
	await newProduct.save();
	response.writeHead(201, "201 Created");
	return await responseUtils.sendJson(response, newProduct, 201);
};
module.exports = { getAllProducts, addProduct};