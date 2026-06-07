import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { randText } from '@ngneat/falso';
import { TodoApiService } from './todoApi.service';
import { Todo } from './todos.model';

@Component({
  imports: [],
  selector: 'app-todo',
  template: `
    @for (todo of todos(); track todo.id) {
      <div class="todo-item">
        <span>{{ todo.title }}</span>
        <button (click)="update(todo)">Update</button>
        <button (click)="delete(todo)">Delete</button>
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
    `,
  ],
})
export class TodoComponent implements OnInit {
  private todoApiService = inject(TodoApiService);

  public todos: WritableSignal<Todo[]> = signal<Todo[]>([]);

  ngOnInit(): void {
    this.todoApiService.getTodos().subscribe((todos) => this.todos.set(todos));
  }

  update(todo: Todo) {
    todo = {
      ...todo,
      title: randText(),
    };
    this.todoApiService.updateTodo(todo).subscribe((updatedTodo: Todo) => {
      this.todos.update((lastTodos: Todo[]) =>
        lastTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    });
  }

  delete(todo: Todo) {
    this.todoApiService.deleteTodo(todo).subscribe(() => {
      this.todos.update((lastTodos: Todo[]) =>
        lastTodos.filter((t) => t.id !== todo.id),
      );
    });
  }
}
