import { ApplicationRef, provideZoneChangeDetection } from '@angular/core';
import { appConfig } from './app/app.config';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

export const appRef: Promise<ApplicationRef | void> = bootstrapApplication(
  AppComponent,
  {
    ...appConfig,
    providers: [provideZoneChangeDetection(), ...appConfig.providers],
  },
).catch((err) => {
  throw new Error(err);
});
