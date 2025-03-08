const Task = require('../models/Task');

class TaskRepository {

    async findAll() {
        return await Task.find().sort({ createdAt: -1 });
      }
    
      async findById(id) {
        return await Task.findById(id);
      }
    
      async create(taskData) {
        const task = new Task(taskData);
        return await task.save();
      }
    
      async update(id, taskData) {
        return await Task.findByIdAndUpdate(
          id, 
          { ...taskData, updatedAt: Date.now() },
          { new: true }
        );
      }
    
      async delete(id) {
        return await Task.findByIdAndDelete(id);
      }

      async lockTaskForEditing(id, socketId) {
        return await Task.findByIdAndUpdate(
          id,
          { isBeingEdited: true, editorSocketId: socketId },
          { new: true }
        );
      }
    
      async unlockTask(id) {
        return await Task.findByIdAndUpdate(
          id,
          { isBeingEdited: false, editorSocketId: null },
          { new: true }
        );
      }
}

module.exports = TaskRepository;