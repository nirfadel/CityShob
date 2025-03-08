const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({

title:{
    type: String,
    required: true,
    trim: true
},
description: {
    type: String,
    trim: true
},
completed: {
    type: Boolean,
    default: false
},
isBeingEdited: {
    type: Boolean,
    default: false
},
editorSocketId: {
    type: String,
    default: null
},
createdAt: {
    type: Date,
    default: Date.now
},
updatedAt: {
    type: Date,
    default: Date.now
}
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;

