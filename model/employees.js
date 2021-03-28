const mongoose = require('mongoose');

let employeeSchema = new mongoose.Schema({
    organization : {
        type : String,
        required: true
    },
    employees:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports = mongoose.model('Employee', employeeSchema);