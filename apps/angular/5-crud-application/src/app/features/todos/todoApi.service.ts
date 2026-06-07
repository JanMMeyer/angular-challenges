import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todos.model';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private readonly baseApiUrl = 'https://jsonplaceholder.typicode.com';

  private http = inject(HttpClient);

  public getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.baseApiUrl}/todos`);
  }

  public updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseApiUrl}/todos/${todo.id}`, todo, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  public deleteTodo(todo: Todo): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/todos/${todo.id}`);
  }
}
