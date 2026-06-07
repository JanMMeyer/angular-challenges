import { HasId } from './common.model';

export interface ListStore<T extends HasId<TId>, TId extends number | string> {
  addAll: (items: T[]) => void;
  addOne: (item: T) => void;
  deleteOne: (id: number) => void;
}
