const responseUtils = require('../utils/responseUtils');
/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllProducts = async response => {
  const data = {
    products: require('../products.json')
  };

  return await responseUtils.sendJson(response, data.products, 200);
};

module.exports = { getAllProducts };