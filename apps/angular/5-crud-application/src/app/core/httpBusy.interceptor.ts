import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, delay, Observable, tap, throwError } from 'rxjs';
import { BusyService } from './busy.service';

let callCounter = 0;
export function httpBusyInterceptor(
  request: HttpRequest<unknown>,
  handleHttp: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  console.log('httpBusyInterceptor');
  const busyService = inject(BusyService);
  const uid = busyService.registerAsBusy();
  return handleHttp(request).pipe(
    tap((event: HttpEvent<unknown>) => {
      console.log('event.type', event.type, 'callCounter', callCounter);
      if (event.type !== HttpEventType.Response) {
        console.log('not a response, no error');
        return;
      }
      if (callCounter++ % 2 !== 0) {
        console.log('call counter is odd, not throwing error');
        return;
      }
      console.warn('throwing error');
      throw new Error('Ooopsie Daisy!');
    }),
    delay(1000),
    catchError((error) => {
      busyService.unregisterAsBusy(uid);
      return throwError(() => error);
    }),
    tap(() => busyService.unregisterAsBusy(uid)),
  );
}
