import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { randText } from '@ngneat/falso';
import {
  DeleteError,
  UpdateError,
  WithError,
} from '../../common/WithError.type';
import { TodoStore } from './todo.store';
import { Todo } from './todos.model';

@Component({
  imports: [MatProgressSpinnerModule],
  selector: 'app-todo',
  template: `
    @if (todoStore.isLoading()) {
      <mat-progress-spinner mode="indeterminate" diameter="60" color="accent" />
    }
    @if (todoStore.error()) {
      <div class="error-message">
        Something went wrong: {{ todoStore.error()?.message }}
        <button (click)="todoStore.fetchTodos()">retry</button>
      </div>
    }
    @for (todo of todoStore.todos(); track todo.id) {
      <div class="todo-item">
        <span>{{ todo.title }}</span>

        @if (hasDeleteError(todo)) {
          <span class="error-message small">Delete failed.</span>
        }
        @if (hasUpdateError(todo)) {
          <span class="error-message small">Update failed.</span>
          <button (click)="retryUpdate(todo)">Retry</button>
        } @else {
          <button (click)="update(todo)">Update</button>
        }
        <button (click)="delete(todo)">
          {{ hasDeleteError(todo) ? 'Retry' : 'Delete' }}
        </button>
      </div>
    }
  `,
  styles: [
    `
      :host {
        width: 600px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .todo-item {
        display: flex;
        justify-content: end;
        gap: 4px;
        align-items: center;
        padding: 4px;
        border: 1px solid hotpink;
        border-radius: 4px;

        span {
          flex-grow: 1;
        }
        button {
          background-color: transparent;
          color: black;
          border: 1px solid hotpink;
          padding: 3px 6px;
          border-radius: 4px;
          &:hover {
            background-color: pink;
          }
          &:active {
            background-color: hotpink;
            color: white;
          }
        }
      }
      mat-progress-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 10;
      }
      .error-message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        padding: 4px;
        border: 1px solid red;
        border-radius: 4px;
        &.small {
          font-size: 12px;
          padding: 2px;
        }
      }
    `,
  ],
  providers: [TodoStore],
})
export class TodoComponent implements OnInit {
  public todoStore = inject(TodoStore);

  ngOnInit(): void {
    console.log('ngOnInit');
    this.todoStore.fetchTodos();
  }

  public retry() {
    this.todoStore.fetchTodos();
  }

  public update(todo: Todo) {
    todo = {
      ...todo,
      title: randText(),
    };

    this.todoStore.updateTodo(todo);
  }

  public retryUpdate(todo: Todo) {
    this.todoStore.updateTodo(todo);
  }

  public delete(todo: Todo) {
    this.todoStore.deleteTodo(todo);
  }

  public hasUpdateError(todo: WithError<Todo>): boolean {
    return todo.error instanceof UpdateError;
  }

  public hasDeleteError(todo: WithError<Todo>): boolean {
    return todo.error instanceof DeleteError;
  }
}
