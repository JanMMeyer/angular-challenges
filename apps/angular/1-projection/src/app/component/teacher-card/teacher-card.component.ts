import { Component, inject, OnInit } from '@angular/core';
import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { Teacher } from '../../model/teacher.model';
import { CardComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      (addClicked)="handleAddClicked()"
      (deleteItemClicked)="handleDeleteItemClicked($event)"
      [list]="teachers()"
      [getItemLabel]="getItemLabel"
      class="bg-light-red">
      <img src="assets/img/teacher.png" width="200" height="200" alt="" />
    </app-card>
  `,
  styles: [
    `
      .bg-light-red {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  imports: [CardComponent],
})
export class TeacherCardComponent implements OnInit {
  private http = inject(FakeHttpService);
  private store = inject(TeacherStore);

  public teachers = this.store.teachers;

  public ngOnInit(): void {
    this.http.fetchTeachers$.subscribe((t) => this.store.addAll(t));
  }

  public handleAddClicked(): void {
    this.store.addOne(randTeacher());
  }

  public handleDeleteItemClicked(id: number): void {
    this.store.deleteOne(id);
  }

  public getItemLabel(item: Teacher): string {
    return `${item.firstName} ${item.lastName} - ${item.subject}`;
  }
}
