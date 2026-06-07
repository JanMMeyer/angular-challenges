import { ErrorHandler } from '@angular/core';

export class TodoAppErrorHandler implements ErrorHandler {
  handleError(error: any) {
    alert(error.message);
  }
}
