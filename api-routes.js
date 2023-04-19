const { authUser, authRole } = require('./authenticate_authorise/basicAuth')
const { ROLE } = require('./data')
const { viewContact, canEditContact, canDeleteContact } = require ('./authenticate_authorise/permission')

// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', authUser, function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    }) ;
});

// Import contact controller
var contactController = require('./contactController');
// Import login controller
var loginController = require('./loginController')
// Import redisController
var redisController = require('./Task 5/redisController')
// Contact routes
router.route('/contacts')
    .put(authUser, contactController.index)
    .post(authUser, contactController.new);
router.route('/contacts/:contact_id')
    .get(authUser, contactController.view)
    .put(authUser, canEditContact, contactController.update)
    .delete(authUser, canEditContact, contactController.delete);
//Login routes
/*router.route('/login')
    .post(loginController.login)
*/
router.route('/register')
    .get(authUser, authRole(ROLE.ADMIN), loginController.view)
    .post(loginController.register)

//Task 5 ruote:
router.route('/photos')
    .get(redisController.task5)

// Export API routes
module.exports = router;