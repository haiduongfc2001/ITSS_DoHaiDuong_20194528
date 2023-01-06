const mongoose = require('mongoose');

mongoose.model('Order', {
    CustomerID: {
        type: mongoose.SchemaType.ObjectId,
        require: true
    },
    BookID: {
        type: mongoose.SchemaType.ObjectId,
        require: true
    },
    initialDate: {
        type: Date,
        require: true
    },
    deliveryDate: {
        type: Date,
        require: true
    }
})