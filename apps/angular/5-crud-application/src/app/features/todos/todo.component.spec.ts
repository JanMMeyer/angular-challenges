import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { delay, of } from 'rxjs';
import { TodoComponent } from './todo.component';
import { TodoApiService } from './todoApi.service';
import { Todo } from './todos.model';

const mockTodos: Todo[] = [
  { id: 1, title: 'Todo 1', completed: false, userId: 1 },
  { id: 2, title: 'Todo 2', completed: false, userId: 2 },
  { id: 3, title: 'Todo 3', completed: false, userId: 3 },
];
const delayedTodoApiServiceMock: TodoApiService = {
  getTodos: () => of(mockTodos).pipe(delay(1000)),
  updateTodo: (todo: Todo) => of(todo).pipe(delay(1000)),
  deleteTodo: (todo: Todo) => of(void 0).pipe(delay(1000)),
} as TodoApiService;

const todoApiServiceMock: TodoApiService = {
  getTodos: () => of(mockTodos),
  updateTodo: (todo: Todo) => of(todo),
  deleteTodo: (todo: Todo) => of(void 0),
} as TodoApiService;

describe('TodoComponent', () => {
  function setup(
    apiServiceMock: TodoApiService,
  ): ComponentFixture<TodoComponent> {
    TestBed.configureTestingModule({
      providers: [{ provide: TodoApiService, useValue: apiServiceMock }],
    });
    return TestBed.createComponent(TodoComponent);
  }

  describe('OnInit Todos are fetched.', () => {
    test('While fetching, a waiting spinner is displayed.', async () => {
      const fixture = setup(delayedTodoApiServiceMock);
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector(
        'mat-progress-spinner',
      );
      expect(spinner).toBeTruthy();
    });
    test('After Fetching todos are displayed.', fakeAsync(() => {
      const fixture = setup(todoApiServiceMock);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      const todos = fixture.nativeElement.querySelectorAll('.todo-item');
      expect(todos.length).toBe(mockTodos.length);
    }));
  });

  // describe('Given maxValue set to 109', () => {
  //   test('Then slider max value is 109', async () => {
  //     await render(TodoComponent);
  //   });
  // });
});
