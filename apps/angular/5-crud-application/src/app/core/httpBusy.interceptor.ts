import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BusyService } from './busy.service';

// @Injectable({ providedIn: 'root' })
// export class HttpBusyInterceptor implements HttpInterceptor {

//   private busyService = inject(BusyService);

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     const uid = this.busyService.registerAsBusy();
//     return next.handle(request).pipe(
//       tap(() => this.busyService.unregisterAsBusy(uid))
//     )
//   }
// }
export function httpBusyInterceptor(
  request: HttpRequest<unknown>,
  handleHttp: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const busyService = inject(BusyService);
  const uid = busyService.registerAsBusy();
  return handleHttp(request).pipe(tap(() => busyService.unregisterAsBusy(uid)));
}
