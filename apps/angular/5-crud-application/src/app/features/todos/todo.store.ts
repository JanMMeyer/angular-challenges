import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { catchError, map, of } from 'rxjs';
import {
  DeleteError,
  UpdateError,
  WithError,
} from '../../common/WithError.type';
import { TodoApiService } from './todoApi.service';
import { Todo } from './todos.model';

function getUid(): string {
  return Math.random().toString(36).substring(2, 15);
}

type TodoState = WithError<{
  todos: WithError<Todo>[];
  loadingUids: Set<string>;
}>;

const initialState: TodoState = {
  todos: [],
  loadingUids: new Set(),
  error: null,
};

export const TodoStore = signalStore(
  withState(initialState),
  withProps(() => ({ todoApiService: inject(TodoApiService) })),
  withComputed(({ loadingUids }) => ({
    isLoading: computed(() => !!loadingUids().size),
  })),
  withMethods((store) => ({
    registerLoading: () => {
      const uid = getUid();
      patchState(store, ({ loadingUids }) => {
        return {
          loadingUids: new Set(loadingUids).add(uid),
        };
      });
      return uid;
    },
    unregisterLoading: (uid: string) => {
      patchState(store, ({ loadingUids }) => {
        loadingUids.delete(uid);
        return {
          loadingUids: new Set(loadingUids),
        };
      });
    },
    resetError: () => {
      patchState(store, () => ({ error: null }));
    },
  })),
  withMethods((store) => ({
    fetchTodos: () => {
      const uid = store.registerLoading();
      store.resetError();
      store.todoApiService
        .getTodos()
        .pipe(
          catchError((error) => {
            store.unregisterLoading(uid);
            patchState(store, () => ({ todos: [], error: error }));
            throw error;
          }),
        )
        .subscribe((fetchedTodos: Todo[]) => {
          const fetchedTodosWithError: WithError<Todo>[] = fetchedTodos.map(
            (todo) => ({ ...todo, error: null }),
          );
          store.unregisterLoading(uid);
          patchState(store, () => ({
            error: null,
            todos: fetchedTodosWithError,
          }));
        });
    },
    updateTodo: (updatedTodo: Todo) => {
      const uid = store.registerLoading();

      store.todoApiService
        .updateTodo(updatedTodo)
        .pipe(
          map((updatedTodoFromBackend: Todo) => ({
            ...updatedTodoFromBackend,
            error: null,
          })),
          catchError((error) => {
            return of({ ...updatedTodo, error: new UpdateError(error) });
          }),
        )
        .subscribe((updatedTodoFromBackend: WithError<Todo>) => {
          store.unregisterLoading(uid);
          patchState(store, ({ todos }) => {
            return {
              todos: todos.map((t) =>
                t.id === updatedTodoFromBackend.id ? updatedTodoFromBackend : t,
              ),
            };
          });
        });
    },
    deleteTodo: (todo: Todo) => {
      const uid = store.registerLoading();

      store.todoApiService
        .deleteTodo(todo)
        .pipe(
          map(() => ({ ...todo, error: null })),
          catchError((error) => {
            return of({ ...todo, error: new DeleteError(error) });
          }),
        )
        .subscribe((deletedTodoFromBackend: WithError<Todo>) => {
          store.unregisterLoading(uid);

          patchState(store, ({ todos }) => {
            const nextTodos = deletedTodoFromBackend.error
              ? todos.map((t) =>
                  t.id === deletedTodoFromBackend.id
                    ? deletedTodoFromBackend
                    : t,
                )
              : todos.filter((t) => t.id !== deletedTodoFromBackend.id);

            return { todos: nextTodos };
          });
        });
    },
  })),
);
