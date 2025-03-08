export interface Task {
    _id?: string;
    title: string;
    description?: string;
    completed: boolean;
    isBeingEdited: boolean;
    editorSocketId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }