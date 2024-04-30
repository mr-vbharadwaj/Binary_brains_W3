const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
                },
    items: { type: Object, required: true },
    phone: { type: String, required: true},
    address: { type: String, required: true},
    paymentType: { type: String, default: 'COD'},
    paymentStatus: { type: Boolean, default: false },
    status: { type: String, default: 'order_placed'},
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)

// const orderSchema = new Schema({
//     customerId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'User',
//                 required: true
//                 },
//     items: { type: Object, required: true },
//     phone: { type: String, required: true},
//     address: { type: String, required: true},
//     paymentType: {
//         type: String,
//         enum: ['card', 'COD'],
//         default: 'COD'
//     },
//     paymentStatus: { type: Boolean, default: false },
//     status: { type: String, default: 'order_placed'},
// }, { timestamps: true })

// module.exports = mongoose.model('Order', orderSchema)

// const Order = require('./Order'); // Assuming your model is in a separate file

// // Create a new order
// const newOrder = new Order({
//     customerId: 'your-customer-id-here', // ObjectId referencing a User document
//     items: { /* your items object here */ },
//     phone: '1234567890',
//     address: '123 Main St',
//     // other fields...
// });

// // Save the order to the database
// newOrder.save()
//     .then(savedOrder => {
//         console.log('Order saved:', savedOrder);
//     })
//     .catch(error => {
//         console.error('Error saving order:', error);
//     });
