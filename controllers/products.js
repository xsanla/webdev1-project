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
 * @param {*} productId 
 */
const getSingleProduct = async (response, productId) => {
	const data = await Product.findOne({_id: productId}).exec();
	
	if(data == null){
		return await responseUtils.notFound(response);
	}
	return await responseUtils.sendJson(response, data, 200);
}
/**
 * 
 * @param {*} response 
 * @param {*} productData 
 */
const updateProduct = async (response, productData, productId) =>{
	if(productData.price == null||productData.name == null||isNaN(productData.price)||productData.price <= 0)
	{
		return await responseUtils.badRequest(response, "400 Bad Request");
	}

	const productToUpdate = await Product.findOne({_id: productId}).exec();
	if(productToUpdate == null){
		return await responseUtils.notFound(response);
	}

	for (var key of Object.keys(productData)) {
		if(productData[key] != null){
			productToUpdate[key] = productData[key];
		}
	}
	await productToUpdate.save();
	return await responseUtils.sendJson(response, productToUpdate, 200);

}
/**
 * 
 * @param {*} response 
 * @param {*} productId 
 * @returns 
 */
const deleteProduct = async (response,productId) =>{
	const deletedProduct = await Product.findOneAndDelete({_id: productId}).exec();
	if(deletedProduct){
		return await responseUtils.sendJson(response, deletedProduct, 200);	
	}
	return await responseUtils.notFound(response);
}
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
module.exports = { getAllProducts, getSingleProduct, addProduct, updateProduct, deleteProduct};