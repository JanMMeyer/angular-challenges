import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CityStore } from '../../data-access/city.store';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { City } from '../../model/city.model';
import { CardComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      (addClicked)="handleAddClicked()"
      (deleteItemClicked)="handleDeleteItemClicked($event)"
      [getItemLabel]="getItemLabel"
      [list]="cities()"
      customClass="bg-light-green">
      <img src="assets/img/city.png" width="200" height="200" alt="" />
    </app-card>
  `,
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent {
  private http = inject(FakeHttpService);
  public store = inject(CityStore);

  public cities = this.store.cities;

  public ngOnInit(): void {
    this.http.fetchCities$.subscribe((c) => this.store.addAll(c));
  }

  public handleAddClicked(): void {
    this.store.addOne(randomCity());
  }

  public handleDeleteItemClicked(id: number): void {
    this.store.deleteOne(id);
  }

  public getItemLabel(item: City): string {
    return `${item.name} - ${item.country}`;
  }
}
