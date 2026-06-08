import { Component, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusyService } from './core/busy.service';
import { TodoComponent } from './features/todos/todo.component';

@Component({
  imports: [TodoComponent, MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    @if (anythingBusy()) {
      <mat-progress-spinner mode="indeterminate" diameter="20" />
    }
    <app-todo />
  `,
  styles: [
    `
      :host {
        min-height: 100vh;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: center;
        background-color: peachpuff;
      }
      mat-progress-spinner {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 10;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private busyService = inject(BusyService);

  public anythingBusy = signal(false);

  public ngOnInit(): void {
    this.busyService.anythingBusy$.subscribe((busy) => {
      this.anythingBusy.set(busy);
    });
  }
}
