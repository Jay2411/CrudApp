const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
    id : {
        type : Number
    },
    title : {
        type: String,
        required:true
    },
    discription : {
        type: String,
        required:true
    },
    created_by : {
        type: String,
        required:true
    },
    completed_by : {
        type: String,
        required:true
    },
    datetime : {
        type: String,
        required:true
    },
    status : {
        type: String,
        required:true
    }
})

const Complaint = new mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;