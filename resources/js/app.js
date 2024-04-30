import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';
import { initStripe } from './stripe';
const express = require('express');
const app = express();
const server = require('http').createServer(app);

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
    axios.post('/update-cart', pizza)
        .then(res => {
            cartCounter.innerText = res.data.totalQty;
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'Item added to cart',
                progressBar: false,
            }).show();
        })
        .catch(err => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Something went wrong',
                progressBar: false,
            }).show();
        });
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    });
});

document.addEventListener('click', function() {
    // Your code here
    let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
});



// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}

// Change order status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed');
        status.classList.remove('current');
    });
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if (stepCompleted) {
            status.classList.add('step-completed');
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current');
            }
        }
    });
}

updateStatus(order);
const paymentType = document.querySelector('#paymentType');

// AJAX call
const paymentForm = document.querySelector('#payment-form');
if (paymentForm) {
    let formObject = {}; // Declare formObject here

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(paymentForm);
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        formObject.order = order;
        axios.post('/orders', formObject)
            .then(res => {
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text: 'Order placed',
                    progressBar: false,
                }).show();
                setTimeout(() => {
                    window.location.href = '/customers/orders';
                }, 1000);
            })
            .catch(err => {
                new Noty({
                    type: 'error',
                    timeout: 1000,
                    text: 'Something went wrong',
                    progressBar: false,
                }).show();
            });
    });
}

initStripe();

// Socket
let socket = io();

// Join
if (order) {
    socket.emit('join', `order_${order._id}`);
}
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
    initAdmin(socket);
    socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order };
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
});

// Import necessary modules and dependencies
// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const moment = require('moment');
// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
// const Order = require('../../../models/order');

// // Create Express app and HTTP server
// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// // Express middleware setup, including body-parser, session, etc.

// // Your route definitions and usage of controllers
// app.use('/admin', require('./routes/admin'));
// app.use('/customer', require('./routes/customer'));

// // Socket.IO setup
// io.on('connection', (socket) => {
//     // Handle socket connections
//     console.log('A user connected');

//     // Join specific rooms or handle other socket events
//     socket.on('join', (room) => {
//         socket.join(room);
//         console.log(`Socket joined room: ${room}`);
//     });

//     // Handle other socket events...
// });

// // Example of emitting 'orderPlaced' event
// const eventEmitter = /* ... */; // Access your eventEmitter
// eventEmitter.on('orderPlaced', (data) => {
//     io.to(`order_${data._id}`).emit('orderPlaced', data);
// });

// // Express route for placing an order
// app.post('/orders', async (req, res) => {
//     try {
//         // Validate request
//         const { phone, address, stripeToken, paymentType } = req.body;
//         if (!phone || !address) {
//             return res.status(422).json({ message: 'All fields are required' });
//         }

//         // Your order creation logic...
//         const order = new Order({
//             customerId: req.user._id,
//             items: req.session.cart.items,
//             phone,
//             address
//         });

//         // Example of emitting 'orderUpdated' event
//         const updatedOrder = /* ... */; // Populate updatedOrder with relevant data
//         io.to(`order_${updatedOrder._id}`).emit('orderUpdated', updatedOrder);

//         return res.json({ message: 'Order placed successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Something went wrong' });
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
