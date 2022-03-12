import { getLocaleMonthNames } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Globals } from '../models/Globals';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  allNotes: any = [];
  allLabels: any = [];
  constructor(private http: HttpClient) {

  }
  getNotes(): Observable<any> {
    return this.http.get(Globals.SERVICE_URI + 'notes');
  }
  getNoteLabels(): Observable<any> {
    return this.http.get(Globals.SERVICE_URI + 'noteLabels');
  }
  updateNote(note: any): Observable<any> {
    return this.http.put(Globals.SERVICE_URI + 'notes/' + note.id, note);
  }
  deleteNote(note: any): Observable<any> {
    return this.http.post(Globals.SERVICE_URI + '/deletenotes', note);
  }

}
