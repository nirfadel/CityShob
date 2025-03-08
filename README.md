# Homework Task - Real-Time Data Synchronization in a To-Do App

## Overview

  This repository contains the technical Homework for Implementing a real-time web application 

### Prerequisites
- Git
- Programming language as specified in the assessment (NodeJS/Angular)
- Any additional frameworks or libraries mentioned in the assessment instructions
- Visual studio code

### Setup Instructions
In the github repo there are some projects and files: 
todo-list folder: This folder contains the code for the NodeJS backend RESTful API, download the folder files and open it on VS code,
run npm install, after finished, run it with 'npm start' the Api will be at :"http://localhost:3334"

todo-list-app folder: This folder contains Angular client and UI, download the folder files and open it with VS code,
run npm install, after finished, run it with 'npm start' the Client will be at : "http://localhost:4200".

ToDo.postman_collection.json: Postman collection for getting all tasks, creating tasks, signup and login

## Assessment Structure
todo-list - Api build with NodeJs :
Code structure: 
  1. controllers - Handle the requests api-
     - authController - All authentication calls (Bonus points)
     - taskController - All task calls
  2. models - All mongoose model for communicate with mongodb
     - task model for crud task operations
     - user model for login and user auth
  3. repository (taskRepository)- repository design pattern for communicate with mongodb
  4. routes - implement the route to the api
     - taskRoutes - all task routes
     - userRoutes - all user auth routes
  5. services - implement separation of concerns in the code
     - socketService - implement the connection and disconnection of the clients via socket
     - taskService - implement all task business calls from api
  6. utils - utilitties for the project
     - appError - implement Error interface for generic error handling
     - carchAsync - wrap all error in async calls
todo-list-app - UI writing with Angular :
Code structure:
1. components - all angular components of the project
   - login - implement login page (Bonus points)
   - signup - implement signup page (Bonus points)
   - task-list - task list component for showing, adding and update tasks
   - task-dialog - task dailog for adding, update and delete tasks
2. model - all client models 
   - task - the task model
3. services - separation of concerns in the project
   - socket.service - handle all client socket operations
   - task.service - handle all task crud + listen to crud events
   - auth.service - handle all authentication in the code (Bones points)
   - auth.interceptor - handle token sending to server for every request
   - auth.guard - guard the routing with authentication
4. environments - handle generic environment domain
 
## decisions and patterns used:
UI - 
1. Build with Angular 19
2. Uses Angular Material for clean UI
3. implements crud restful api
4. shows real time update using lock calls
5. showing notification for the user when editing
6. using design patterns -
   - service, observer pattern with RxJS, Reactive programming
7. using jwt token saved in localstorage for authenticate
8. using BehaviorSubject for notify the user
9. using subscriptions to events with observable
    
Backend -
1. create socket connections for connecting clients using Socket.IO
2. connect mongodb using mongoose
3. Secure the project by using different protections against attacks:
   - mongoSanitize - against nosql query injection
   - xss - against xss attacks
   - using cors for specific domain
4. Dependency Injection in task service and controller
5. service design - separation of concerns
6. locking mechanism for no one can edit the same task
7. Repository pattern for communicate with the db
8. adding middleware to user model
9. using MVC architecture - Model-View-Controller design
    
11. 

