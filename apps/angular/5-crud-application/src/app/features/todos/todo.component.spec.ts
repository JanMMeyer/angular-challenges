import { StaticProvider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { TodoStore } from './todo.store';

describe('TodoComponent', () => {
  function setup(
    providers?: StaticProvider[],
  ): ComponentFixture<TodoComponent> {
    TestBed.configureTestingModule({ providers });
    TestBed.inject(TodoStore);
    return TestBed.createComponent(TodoComponent);
  }

  describe('When init', () => {
    test('A waiting spinner is displayed', async () => {
      const fixture = setup();
      const spinner = fixture.nativeElement.querySelector(
        'mat-progress-spinner',
      );
      expect(spinner).toBeTruthy();
    });

    // test('Then initial value of slider thumb is 0', async () => {
    //   await render(TodoComponent);
    // });
  });

  // describe('Given maxValue set to 109', () => {
  //   test('Then slider max value is 109', async () => {
  //     await render(TodoComponent);
  //   });
  // });
});
