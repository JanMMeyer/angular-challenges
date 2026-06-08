import { ErrorHandler } from '@angular/core';

export class TodoAppErrorHandler implements ErrorHandler {
  handleError(error: any) {
    console.error(
      'This should be sent to a logging server! Error Message:',
      error.message,
    );
  }
}
