class SocketService {
    constructor(io) {
      this.io = io;
      this.socketConnections = new Map();
      this.initSocketListeners();
    }
  
    initSocketListeners() {
      this.io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        this.socketConnections.set(socket.id, socket);
        
        socket.on('disconnect', () => {
          console.log(`Client disconnected: ${socket.id}`);
          this.socketConnections.delete(socket.id);
          
          // Handle disconnection logic (e.g., unlock any tasks being edited by this socket)
          this.handleDisconnection(socket.id);
        });
      });
    }
  
    async handleDisconnection(socketId) {
      // This would typically be handled by a connection to your task service
      // For simplicity, we're just emitting an event that the client can handle
      this.emitToAll('editor:disconnected', socketId);
    }
  
    emitToAll(event, data) {
      this.io.emit(event, data);
    }
  
    emitToSocket(socketId, event, data) {
      const socket = this.socketConnections.get(socketId);
      if (socket) {
        socket.emit(event, data);
      }
    }
  }
  
  module.exports = SocketService;