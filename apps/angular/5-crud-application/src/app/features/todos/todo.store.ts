import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { WithError } from '../../common/WithError.type';
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
    registerLoading: (uid: string) => {
      patchState(store, ({ loadingUids }) => {
        return {
          loadingUids: new Set(loadingUids).add(uid),
        };
      });
    },
    unregisterLoading: (uid: string) => {
      patchState(store, ({ loadingUids }) => {
        loadingUids.delete(uid);
        return {
          loadingUids: new Set(loadingUids),
        };
      });
    },
  })),
  withMethods((store) => ({
    registerLoading: (uid: string) => {
      patchState(store, ({ loadingUids }) => {
        return {
          loadingUids: new Set(loadingUids).add(uid),
        };
      });
    },
    unregisterLoading: (uid: string) => {
      patchState(store, ({ loadingUids }) => {
        loadingUids.delete(uid);
        return {
          loadingUids: new Set(loadingUids),
        };
      });
    },
    fetchTodos: () => {
      const uid = getUid();

      store.registerLoading(uid);

      store.todoApiService.getTodos().subscribe((fetchedTodos: Todo[]) => {
        const todos = fetchedTodos.map((todo) => ({ ...todo, error: null }));
        patchState(store, ({ loadingUids }) => {
          loadingUids.delete(uid);
          return {
            todos,
            loadingUids: new Set(loadingUids),
          };
        });
      });
    },
    updateTodo: (todo: Todo) => {},
  })),
);
