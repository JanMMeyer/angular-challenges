import { Injectable, signal } from '@angular/core';
import { ListStore } from '../model/listStore.model';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentStore implements ListStore<Student, number> {
  public students = signal<Student[]>([]);

  addAll(students: Student[]) {
    this.students.set(students);
  }

  addOne(student: Student) {
    this.students.set([...this.students(), student]);
  }

  deleteOne(id: number) {
    this.students.set(this.students().filter((s) => s.id !== id));
  }
}
