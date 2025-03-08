// client/src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Task } from '../model/task';
import { SocketService } from './socket.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = `${environment.baseUrl}/api/v1/tasks`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) {
    this.setupSocketListeners();
    this.loadAllTasks();
  }

  // Setup real-time updates using socket.io
  private setupSocketListeners(): void {
    // Listen for task created event
    this.socketService.onEvent<Task>('task:created').subscribe(newTask => {
      const currentTasks = this.tasksSubject.value;
      this.tasksSubject.next([newTask, ...currentTasks]);
    });

    // Listen for task updated event
    this.socketService.onEvent<Task>('task:updated').subscribe(updatedTask => {
      const currentTasks = this.tasksSubject.value;
      const updatedTasks = currentTasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      );
      this.tasksSubject.next(updatedTasks);
    });

    // Listen for task deleted event
    this.socketService.onEvent<string>('task:deleted').subscribe(taskId => {
      const currentTasks = this.tasksSubject.value;
      const updatedTasks = currentTasks.filter(task => task._id !== taskId);
      this.tasksSubject.next(updatedTasks);
    });

    // Listen for task locked event
    this.socketService.onEvent<Task>('task:locked').subscribe(lockedTask => {
      const currentTasks = this.tasksSubject.value;
      const updatedTasks = currentTasks.map(task => 
        task._id === lockedTask._id ? lockedTask : task
      );
      this.tasksSubject.next(updatedTasks);
    });

    // Listen for task unlocked event
    this.socketService.onEvent<Task>('task:unlocked').subscribe(unlockedTask => {
      const currentTasks = this.tasksSubject.value;
      const updatedTasks = currentTasks.map(task => 
        task._id === unlockedTask._id ? unlockedTask : task
      );
      this.tasksSubject.next(updatedTasks);
    });

    // Listen for editor disconnected event
    this.socketService.onEvent<string>('editor:disconnected').subscribe(socketId => {
      const currentTasks = this.tasksSubject.value;
      const updatedTasks = currentTasks.map(task => {
        if (task.editorSocketId === socketId) {
          return { ...task, isBeingEdited: false, editorSocketId: undefined };
        }
        return task;
      });
      this.tasksSubject.next(updatedTasks);
    });
  }

  // Load all tasks from the server
  loadAllTasks(): void {
    this.http.get<Task[]>(this.baseUrl)
      .pipe(
        tap(tasks => this.tasksSubject.next(tasks)),
        catchError(error => {
          console.error('Error loading tasks', error);
          return of([]);
        })
      )
      .subscribe();
  }

  // Create a new task
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  // Update an existing task
  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  // Delete a task
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Lock a task for editing
  lockTaskForEditing(id: string): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/${id}/lock`, { 
      socketId: this.socketService.getSocketId() 
    });
  }

  // Unlock a task
  unlockTask(id: string): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/${id}/unlock`, {});
  }

  // Check if current user is the editor of a task
  isCurrentUserEditing(task: Task): boolean {
    return task.isBeingEdited && task.editorSocketId === this.socketService.getSocketId();
  }

  // Get a single task by id
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }
}