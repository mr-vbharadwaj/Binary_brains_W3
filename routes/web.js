const multer = require('multer');
const express = require('express');
const app = express();
const storage = multer.diskStorage({
    destination: 'public/img',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const menuController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const businessController = require('../app/http/controllers/business/businessController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')

function initRoutes(app) {
    app.get('/index',menuController.index)
    app.get('/', menuController.home)
    app.get('/home', menuController.index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    // Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customers/orders', auth, orderController().index)
    app.get('/customers/orders/:id', auth, orderController().show)

    // Business routes
    app.get('/business/orders', auth,businessController().index);
    app.get('/insert', auth, menuController.renderForm);
    app.post('/insert', auth, upload.single('image'), menuController.addMenuItem);

    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)

    // Delivery routes
}

module.exports = initRoutes
//
// //



// const menuController = require('../app/http/controllers/homeController')
// const authController = require('../app/http/controllers/authController')
// const cartController = require('../app/http/controllers/customers/cartController')
// const orderController = require('../app/http/controllers/customers/orderController')
// const adminOrderController = require('../app/http/controllers/admin/orderController')
// const statusController = require('../app/http/controllers/admin/statusController')

// // Middlewares 
// const guest = require('../app/http/middlewares/guest')
// const auth = require('../app/http/middlewares/auth')
// const admin = require('../app/http/middlewares/admin')
const { appendFileSync } = require('fs')

// function initRoutes(app) {
//     app.get('/', menuController.index)
//     app.get('/login', guest, authController().login)
//     app.post('/login', authController().postLogin)
//     app.get('/register', guest, authController().register)
//     app.post('/register', authController().postRegister)
//     app.post('/logout', authController().logout)

//     app.get('/cart', cartController().index)
//     app.post('/update-cart', cartController().update)

//     // Customer routes
//     app.post('/orders', auth, orderController().store)
//     app.get('/customer/orders', auth, orderController().index)
//     app.get('/customer/orders/:id', auth, orderController().show)

//     // Admin routes
//     app.get('/admin/orders', admin, adminOrderController().index)
//     app.post('/admin/order/status', admin, statusController().update)

//     //business
//     app.get('/insert', menuController.renderForm);
//     app.post('/insert', upload.single('image'), menuController.addMenuItem);

// }

// module.exports=initRoutes
