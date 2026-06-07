import { Component, input, output } from '@angular/core';
import { HasId } from '../../model/common.model';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-card',
  template: `
    <ng-content />
    <section>
      @for (item of list(); track item.id) {
        <app-list-item
          [item]="item"
          [getItemLabel]="getItemLabel()"
          (deleteItemClicked)="deleteItemClicked.emit($event)" />
      }
    </section>

    <button
      class="rounded-sm border border-blue-500 bg-blue-300 p-2"
      (click)="addClicked.emit()">
      Add
    </button>
  `,
  imports: [ListItemComponent],
  host: {
    class: 'p-4 border border-grey rounded-sm flex flex-col w-fit',
  },
})
export class CardComponent<T extends HasId<TId>, TId extends number | string> {
  public readonly addClicked = output<void>();
  public readonly deleteItemClicked = output<TId>();

  public readonly list = input<T[] | null>(null);
  public readonly getItemLabel = input.required<(item: T) => string>();

  public readonly customClass = input('');
}
