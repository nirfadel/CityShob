const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socket = require('socket.io');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const TaskRepository = require('./repository/TaskRepository');
const TaskService = require('./services/TaskService');
const SocketService = require('./services/socketService');
const TaskController = require('./controllers/TaskController');

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
  app.use(express.json());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

  // Data sanitization against XSS
app.use(xss());

  // Setup Socket.io
const socketService = new SocketService(io);

// Setup Dependency Injection
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService, socketService);
app.use('/api/v1/tasks', taskRouter(taskController));
app.use('/api/v1/users', userRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

module.exports = {app, server};




