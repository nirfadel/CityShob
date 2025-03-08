class TaskController {
constructor(taskService, socketService) {
  this.taskService = taskService;
  this.socketService = socketService;
}

getAllTasks = async (req, res) => {
        try {
          const tasks = await  this.taskService.getAllTasks();
          return res.status(200).json(tasks);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      };
    
      getTaskById = async (req, res) => {
        try {
          const task = await this.taskService.getTaskById(req.params.id);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          return res.status(200).json(task);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      };
    
      createTask = async (req, res) => {
        try {
          const task = await this.taskService.createTask(req.body);
          
          // Notify all clients about the new task
          this.socketService.emitToAll('task:created', task);
          
          return res.status(201).json(task);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      };
    
      updateTask = async (req, res) => {
        try {
          const task = await this.taskService.updateTask(req.params.id, req.body);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          
          // Notify all clients about the updated task
          this.socketService.emitToAll('task:updated', task);
          
          return res.status(200).json(task);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      };
    
      deleteTask = async (req, res) => {
        try {
          const task = await this.taskService.deleteTask(req.params.id);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          
          // Notify all clients about the deleted task
          this.socketService.emitToAll('task:deleted', req.params.id);
          
          return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      };
    
      lockTaskForEditing = async (req, res) => {
        try {
          const { socketId } = req.body;
          if (!socketId) {
            return res.status(400).json({ message: 'Socket ID is required' });
          }
          
          const task = await this.taskService.lockTaskForEditing(req.params.id, socketId);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          
          // Notify all clients about the locked task
          this.socketService.emitToAll('task:locked', task);
          
          return res.status(200).json(task);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      };
    
      unlockTask = async (req, res) => {
        try {
          const task = await this.taskService.unlockTask(req.params.id);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          
          // Notify all clients about the unlocked task
          this.socketService.emitToAll('task:unlocked', task);
          
          return res.status(200).json(task);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      };

    }

    module.exports = TaskController;