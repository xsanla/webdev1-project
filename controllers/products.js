const responseUtils = require('../utils/responseUtils');
const Product = require('../models/product');
/**
 * Gets all the products form the database
 * @param {httpmessage} response the response to be sent out
 * @returns All the existing products in the database as Json in the body of the response
 */
const getAllProducts = async response => {
  	const data = await Product.find({});

  	return await responseUtils.sendJson(response, data, 200);
};

/**
 * Gets a single product form the database by its id
 * @param {httpmessage} response the response to be sent out 
 * @param {object} productId the id of the product to get 
 * @returns the requested product data as json in the body of the response if the product exists
 * otherwise returns a not found response
 */
const getSingleProduct = async (response, productId) => {
	const data = await Product.findOne({_id: productId}).exec();
	
	if(data == null){
		return await responseUtils.notFound(response);
	}
	return await responseUtils.sendJson(response, data, 200);
}

/**
 * Updates the specific products data
 * @param {httpmessage} response the http response to be sent out 
 * @param {object} productData the data to be updated onto the product
 * @param {object} productId the id of the product to be updated
 * @returns the updated product data as json if product found and updatedata was complete
 * else returns with badRequest (data missing) or notFound (product doesn't exist)
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
 * Deletes the requested product
 * @param {httpmessage} response the http response to be sent out 
 * @param {object} productId the id of the product to delete 
 * @returns json of the product to delete or notfound response if product not founds
 */
const deleteProduct = async (response,productId) =>{
	const deletedProduct = await Product.findOneAndDelete({_id: productId}).exec();
	if(deletedProduct){
		return await responseUtils.sendJson(response, deletedProduct, 200);	
	}
	return await responseUtils.notFound(response);
}
/**
 * Adds a product to the database
 * @param {httpmessage} response the http response tobe sent out
 * @param {object} productData the data of the product to be added 
 * @returns  if data is incomplete returns badRequest
 * otherwise returns the newProduct object as json
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