import { Injectable, signal } from '@angular/core';
import { City } from '../model/city.model';
import { ListStore } from '../model/listStore.model';

@Injectable({
  providedIn: 'root',
})
export class CityStore implements ListStore<City, number> {
  public cities = signal<City[]>([]);

  addAll(cities: City[]) {
    this.cities.set(cities);
  }

  addOne(city: City) {
    this.cities.set([...this.cities(), city]);
  }

  deleteOne(id: number) {
    this.cities.set(this.cities().filter((s) => s.id !== id));
  }
}
