import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { TodoAppErrorHandler } from './core/errorHandler.class';
import { httpBusyInterceptor } from './core/httpBusy.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpBusyInterceptor])),
    { provide: ErrorHandler, useClass: TodoAppErrorHandler },
  ],
};
