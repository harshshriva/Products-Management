const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    items: [{
        productId: {
            required: true,
            type: ObjectId,
            ref: 'Product'
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },
    }],

    totalPrice: {
        type: Number,
        required: true,
        comment: "Holds total price of all the items in the cart"
    },

    totalItems: {
        type: Number,
        required: true,
        comment: "Holds total number of items in the cart"
    },

    totalQuantity: { type: Number, required: true, comment: "Holds total number of quantity in the cart" },

    cancellable: { type: Boolean, default: true },

    status: {
        type: String,
        default: 'pending',
        enum: ["pending", "completed", "cancled"]
    },

    deletedAt: { type: Date },

    isDeleted: { type: Boolean, default: false }


}, { timestamps: true })

module.exports = mongoose.model('cartOrder', cartSchema)