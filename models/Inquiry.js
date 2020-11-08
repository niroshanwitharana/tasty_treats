const mongoose = require('mongoose');

const InquirieSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true      
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        require: true,
        validate: [({ length }) => length <= 1000, "Description should be less than 1000 characters."]
    },
    subscribe: {
        type: Boolean,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    
});

module.exports = mongoose.model('Inquiry', InquirieSchema);