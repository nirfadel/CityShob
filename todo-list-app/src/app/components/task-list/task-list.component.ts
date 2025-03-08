import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Task } from '../../model/task';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: false
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private tasksSubscription!: Subscription;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  openTaskDialog(task?: Task): void {
    // If task is provided and is being edited by someone else, show warning
    if (task && task.isBeingEdited && !this.taskService.isCurrentUserEditing(task)) {
      this.snackBar.open('This task is currently being edited by another user.', 'Close', {
        duration: 3000
      });
      return;
    }

    // If task is provided and not locked, lock it first
    if (task && !task.isBeingEdited) {
      this.taskService.lockTaskForEditing(task._id!).subscribe(
        lockedTask => {
          this.openDialog(lockedTask);
        },
        error => {
          this.snackBar.open('Could not lock task for editing. Please try again.', 'Close', {
            duration: 3000
          });
        }
      );
    } else {
      // For new tasks or if the task is already locked by the current user
      this.openDialog(task);
    }
  }

  private openDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { task: task ? { ...task } : { title: '', completed: false } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          // Unlock the task after editing
          this.taskService.unlockTask(task._id!).subscribe();
          
          if (result.delete) {
            this.deleteTask(task._id!);
          } else {
            this.updateTask(task._id!, result.task);
          }
        } else if (result.task) {
          this.createTask(result.task);
        }
      } else if (task) {
        // Dialog was closed without saving, unlock the task
        this.taskService.unlockTask(task._id!).subscribe();
      }
    });
  }

  createTask(task: Partial<Task>): void {
    this.taskService.createTask(task).subscribe(
      newTask => {
        this.snackBar.open('Task created successfully', 'Close', { duration: 2000 });
      },
      error => {
        this.snackBar.open('Error creating task', 'Close', { duration: 2000 });
      }
    );
  }

  updateTask(id: string, task: Partial<Task>): void {
    this.taskService.updateTask(id, task).subscribe(
      updatedTask => {
        this.snackBar.open('Task updated successfully', 'Close', { duration: 2000 });
      },
      error => {
        this.snackBar.open('Error updating task', 'Close', { duration: 2000 });
      }
    );
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(
      () => {
        this.snackBar.open('Task deleted successfully', 'Close', { duration: 2000 });
      },
      error => {
        this.snackBar.open('Error deleting task', 'Close', { duration: 2000 });
      }
    );
  }

  toggleTaskStatus(task: Task): void {
    if (task.isBeingEdited && !this.taskService.isCurrentUserEditing(task)) {
      this.snackBar.open('This task is currently being edited by another user.', 'Close', {
        duration: 3000
      });
      return;
    }

    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(task._id!, updatedTask).subscribe(
      result => {
        this.snackBar.open(`Task marked as ${result.completed ? 'completed' : 'incomplete'}`, 'Close', {
          duration: 2000
        });
      },
      error => {
        this.snackBar.open('Error updating task status', 'Close', { duration: 2000 });
      }
    );
  }

  isTaskBeingEditedByOthers(task: Task): boolean {
    return task.isBeingEdited && !this.taskService.isCurrentUserEditing(task);
  }
}