/**
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

var form = document.getElementById("register-form");


form.addEventListener("submit", async function(evt){
    evt.preventDefault();
    var formData = new FormData(form);
    var name = formData.get("name");
    var email = formData.get("email");
    var password = formData.get("password");
    var passwordConf = formData.get("passwordConfirmation");
    
    const userData = Object.fromEntries(formData.entries());
    delete userData.passwordConfirmation;
    if (password != passwordConf)
    {   
       createNotification("Passwords must match!",'notifications-container',false);
    }
    else if(name === '' || name == null || email === '' || email == null)
    {
        createNotification("Email and/or name must not be empty", 'notifications-container',false);
    }
    else 
    {   
        const boi = await postOrPutJSON("/api/register", 'POST', userData)
        createNotification("User created successfully",'notifications-container',true);
        form.reset();
    }
});