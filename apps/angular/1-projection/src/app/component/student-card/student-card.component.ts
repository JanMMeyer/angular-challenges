import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { Student } from '../../model/student.model';
import { CardComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      (addClicked)="handleAddClicked()"
      (deleteItemClicked)="handleDeleteItemClicked($event)"
      [getItemLabel]="getItemLabel"
      [list]="students()"
      class="bg-light-green">
      <img src="assets/img/student.webp" width="200" height="200" alt="" />
    </app-card>
  `,
  styles: [
    `
      .bg-light-green {
        background-color: rgba(0, 250, 0, 0.1);
      }
    `,
  ],
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent implements OnInit {
  private http = inject(FakeHttpService);
  public store = inject(StudentStore);

  students = this.store.students;

  public ngOnInit(): void {
    this.http.fetchStudents$.subscribe((s) => this.store.addAll(s));
  }

  public handleAddClicked(): void {
    this.store.addOne(randStudent());
  }

  public handleDeleteItemClicked(id: number): void {
    this.store.deleteOne(id);
  }

  public getItemLabel(item: Student): string {
    return `${item.firstName} ${item.lastName}`;
  }
}
