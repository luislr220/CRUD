const mongoose = require('mongoose');

const ProductoEsquema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    price: {
        type: Number,
        required:true,
    },
    description: {
        type: String,       
    },
    images: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});
   
module.exports = mongoose.model('product', ProductoEsquema);
