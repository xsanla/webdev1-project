const baseUrl = 'http://localhost:3000/api/';

/**
 * Asynchronously fetch JSON from the given url. (GET)
 *
 * Uses fetch to get JSON from the backend and returns the parsed
 * JSON back.
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await getJSON("/api/users");
 *
 *   -- OR --
 *
 *   getJSON("/api/users").then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {string} url resource url on the server
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const getJSON = async url => {
  const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Network response was not OK');
  return await response.json();
};

/**
 * Asynchronously update existing content or create new content on the server (PUT or POST)
 *
 * Uses fetch to send data as JSON to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * @param {string} method "PUT" or "POST"
 * @param {object|Array} data payload data to be sent to the server as JSON
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const postOrPutJSON = async(url, method, data = {}) => {
  method = method.toUpperCase();
  if (method !== 'POST' && method !== 'PUT') {
    throw 'Invalid method! Valid methods are POST and PUT!';
  }

  const response = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error('Network response was not OK');
  if (response.status < 200 || response.status > 400) {
    throw new Error(`Received "${response.status} ${response.statusText}"`);
  }

  return await response.json();
};

/**
 * Asynchronously remove a resource from the server (DELETE)
 *
 * Uses fetch to send the request to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const deleteResource = async url => {
  // TODO: 8.6 Implement this
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) throw new Error('Network response was not OK');
  if (response.status < 200 || response.status > 400) {
    throw new Error(`Received "${response.status} ${response.statusText}"`);
  }

  return await response.json();
};

/**
 * Generate random unique id to use as id value on notifications
 * or other HTML elements (remember that IDs must be unique within
 * a document).
 *
 * @returns {string} the generated id
 */
const generateId = () => {
  // Shamelessly borrowed from a Gist. See:
  // https://gist.github.com/gordonbrander/2230317
  return (
    '_' +
    Math.random()
    .toString(36)
    .substr(2, 9)
  );
};

/**
 * Create a notification message that disappears after five seconds.
 *
 * Appends a new paragraph inside the container element and gives it
 * class based on the status of the message (success or failure).
 *
 * @param {string} message the text content to be displayed
 * @param {string} containerId id attribute of the container element
 * @param {boolean} isSuccess whether the message describes a success or a failure
 */
const createNotification = (message, containerId, isSuccess = true) => {
  const container = document.getElementById(containerId);

  // Create new p element to hold text
  const newParagraph = document.createElement('p');

  // Create unique id for the notification so that it can easily be removed after timeout
  const notificationId = generateId();
  newParagraph.id = notificationId;

  // Set CSS class for the paragraph based on the isSuccess variable
  newParagraph.classList.add(isSuccess ? 'background-lightgreen' : 'background-red');

  // Add message test inside the paragraph and append the paragraph to the container
  newParagraph.append(document.createTextNode(message));
  container.append(newParagraph);

  // After five seconds remove the notification
  setTimeout(() => {
    removeElement(containerId, notificationId);
  }, 5000);
};

/**
 * Remove an element (and its descendants) from the DOM.
 *
 * @param {string} containerId containing element's id
 * @param {string} elementId id of the element to be removed
 */
const removeElement = (containerId, elementId) => {
  const container = document.getElementById(containerId);
  container.querySelectorAll('#' + CSS.escape(elementId)).forEach(element => element.remove());
};

/**
 * Adds an product to the cart
 * cart is implemented using session storage
 * @param {object} productId (mongoose document object id)
 * @returns the number of items of the added variety in the cart
 */
const addProductToCart = productId => {
  const productCount = getProductCountFromCart(productId);
  !productCount
    ?
    sessionStorage.setItem(productId, 1) :
    sessionStorage.setItem(productId, Number(productCount) + 1);
  return getProductCountFromCart(productId);
};

/**
 * decreases product count of a product in the cart
 * if item count reaches 0 item is removed from the cart
 * @param {object} productId (mongoose document object id)
 * @returns the new item count of the given item
 */
const decreaseProductCount = productId => {
  const productCount = getProductCountFromCart(productId);
  if (productCount > 1) {
    const newCount = Number(productCount) - 1;
    sessionStorage.setItem(productId, newCount);
    return newCount;
  } else {
    sessionStorage.removeItem(productId);
    return 0;
  }
};

/**
 * Gets a specific item from the cart
 * @param {object} productId (mongoose document object id)
 * @returns the item in the cart
 */
const getProductCountFromCart = productId => {
  return sessionStorage.getItem(productId);
};

/**
 * Gets all the items from the cart
 * @returns {Array} and array of objects that are in the cart
 */
const getAllProductsFromCart = () => {
  return Object.keys(sessionStorage).reduce((array, str) => {
    const item = {
      name: str,
      amount: sessionStorage.getItem(str)
    };
    return [...array, item];
  }, []);
};

/**
 * clears the cart aka session storage
 */
const clearCart = () => {
  sessionStorage.clear();
};

