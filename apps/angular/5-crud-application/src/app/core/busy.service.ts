import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BusyService {
  private _uid: number = 0;
  private busy$ = new BehaviorSubject<Set<string>>(new Set());

  public readonly anythingBusy$: Observable<boolean> = this.busy$.pipe(
    map((busy) => !!busy.size),
  );

  public registerAsBusy(): string {
    const uid = this.getUid();
    const nextBusy = new Set(this.busy$.value).add(uid);
    this.busy$.next(nextBusy);
    return uid;
  }

  public unregisterAsBusy(uid: string): boolean {
    const nextBusy = new Set(this.busy$.value);
    const hadUid = nextBusy.delete(uid);
    this.busy$.next(nextBusy);
    return hadUid;
  }

  private getUid(): string {
    const nextUid = this._uid++;
    return nextUid.toString();
  }
}
