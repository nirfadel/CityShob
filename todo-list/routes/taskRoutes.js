const express = require('express');
const authController = require('../controllers/authController');
module.exports = (taskController) => {
const router = express.Router();

router.route('/')
.get(taskController.getAllTasks)
.post(taskController.createTask);

router.route('/:id')
.get(taskController.getTaskById)
.put(taskController.updateTask)
.delete(authController.protect, authController.restrictTo('admin'), taskController.deleteTask);

router.post('/:id/lock', taskController.lockTaskForEditing);

router.post('/:id/unlock', taskController.unlockTask);

return router;
};



