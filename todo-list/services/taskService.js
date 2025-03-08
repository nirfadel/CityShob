class TaskService {

  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async getAllTasks() {
    return await this.taskRepository.findAll();
  }
    async getTaskById(id) {
        return await this.taskRepository.findById(id);
      }
    
      async createTask(taskData) {
        return await this.taskRepository.create(taskData);
      }
    
      async updateTask(id, taskData) {
        return await this.taskRepository.update(id, taskData);
      }
    
      async deleteTask(id) {
        return await this.taskRepository.delete(id);
      }
    
      async lockTaskForEditing(id, socketId) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
          return null;
        }
        
        if (task.isBeingEdited && task.editorSocketId !== socketId) {
          throw new Error('Task is already being edited by another user');
        }
        
        return await this.taskRepository.lockTaskForEditing(id, socketId);
      }
    
      async unlockTask(id) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
          return null;
        }
        
        return await this.taskRepository.unlockTask(id);
      }
}

module.exports = TaskService;