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

module.exports = { getAllProducts };