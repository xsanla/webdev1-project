
const addToCart = (productId, productName) => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // /public/js/utils.js also includes createNotification() function
  addProductToCart(productId);
  const msg = "Added "+ productName + " to cart!";
  createNotification(msg, 'notifications-container', true);
};

(async() => {
  //TODO 9.2 
  // - get the 'products-container' element
  // - get the 'product-template' element
  // - use getJSON(url) to get the available products
  // - for each of the products:
  //    * clone the template
  //    * add product information to the template clone
  //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
  // - remember to add the products to the the page
  const productCont = document.getElementById("products-container");
  const temp = document.getElementById("product-template").content;
  
  

  const data = await getJSON("/api/products");
  data.forEach(element => {
    const productTemplate = document.importNode(temp, true);
    
    let productName = productTemplate.querySelector(".product-name");
    let productDescription = productTemplate.querySelector(".product-description");
    let productPrice = productTemplate.querySelector(".product-price");
    let addCartButton = productTemplate.querySelector("button")

    productName.innerText = element.name;
    productName.id = "name-" +element._id;
    
    productDescription.innerText = element.description;
    productDescription.id = "description-" +element._id;
    
    productPrice.innerText = element.price;
    productPrice.id = "price-" +element._id;

    addCartButton.id ="add-to-cart-" +element._id;

    addCartButton.addEventListener('click', function(e){
      // Asummes the id is in the same format as in products.json file!!
      const id = e.target.id.split('-');
      console.log(id[3]);
      addToCart(id[3], productName.innerText);
    });
    productCont.appendChild(productTemplate);
  });

  
})();