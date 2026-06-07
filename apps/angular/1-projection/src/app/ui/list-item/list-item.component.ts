import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { HasId } from '../../model/common.model';

@Component({
  selector: 'app-list-item',
  template: `
    <div class="flex justify-between border border-gray-300 px-2 py-1">
      {{ itemLabel() }}
      <button (click)="deleteItemClicked.emit(item().id)">
        <img class="h-5" src="assets/svg/trash.svg" alt="trash" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent<
  T extends HasId<TId>,
  TId extends number | string,
> {
  public readonly deleteItemClicked = output<TId>();

  public readonly item = input.required<T>();
  public readonly getItemLabel = input.required<(item: T) => string>();
  public readonly itemLabel = computed(() => {
    const item = this.item();
    const getItemLabel = this.getItemLabel();
    return getItemLabel(item);
  });
}
