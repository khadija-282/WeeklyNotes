import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { NotesService } from 'src/app/services/notes.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Globals } from 'src/app/models/Globals';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges {
  @Input() date: Date = new Date();
  @Input() labelType: number = 0;
  @Output() isBusy: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('cardNote') cardNote!: any;

  filteredNotes: any = [];
  panelOpenState = false;
  display = false;
  notesForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    summary: new FormControl('', [Validators.maxLength(250), Validators.required]),
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
    labels: new FormControl('', Validators.required)
  });
  severity = [{ id: 1, value: 'success' }, { id: 2, value: 'warning' }, { id: 3, value: 'danger' }, { id: 4, value: 'default' }];
  constructor(public noteService: NotesService, private confirmationService: ConfirmationService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.filterNotes();
  }
  ngOnInit(): void {

  }
  get f(): any {
    return this.notesForm.controls;
  }
  filterNotes() {
    this.filteredNotes = this.noteService.allNotes.filter((x: any) => {
      const startDate = new Date(x.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(x.endDate);
      const inputDate = new Date(this.date);
      endDate.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      const Difference_In_Time = endDate.getDate() - startDate.getDate();
      const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      // when start and end date are same then we can compare the start date with date and month
      // ignoring year because the year in json list is 1970.
      const betweenDates = Difference_In_Days == 0 ? startDate.getDate() === inputDate.getDate() && inputDate.getMonth() === startDate.getMonth()
        : startDate >= inputDate && endDate <= inputDate;
      x.Duration = Difference_In_Days;
      return x.labels.filter((y: any) => y == this.labelType).length > 0 && betweenDates
    });
    const toSlice = this.filteredNotes.length - Globals.MAXSTACK;
    this.filteredNotes = this.filteredNotes.slice(0, toSlice);
  }
  submit() {
    const note = this.notesForm.getRawValue();
    this.isBusy.emit(true);
    this.noteService.updateNote(note).subscribe((res: any) => {
      this.isBusy.emit(false);
      const found = this.filteredNotes.find((x: any) => parseInt(x.id, 10) === parseInt(note.id, 10));
      if (found) {
        const index = this.filteredNotes.indexOf(found);
        this.filteredNotes[index] = res.noteData;
      }
      this.refresh();
      this.display = false;
    });
  }
  edit(note: any) {
    this.display = true;
    note.startDate = new Date(note.startDate);
    note.endDate = new Date(note.endDate);
    this.notesForm.patchValue(note);
  }
  delete(note: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.isBusy.emit(true);
        const found = this.filteredNotes.find((x: any) => parseInt(x.id, 10) === parseInt(note.id, 10));
        if (found) {
          const index = this.filteredNotes.indexOf(found);
          this.filteredNotes.splice(index, 1);
          this.refresh();
        }
        this.isBusy.emit(false);
        return true;
      },
      reject: () => {
        return true;
      }
    });
  }
  getLabel(id: number): any {
    const found = this.noteService.allLabels.find((x: any) => x.id === id);
    if (found) {
      const severityFound = this.severity.find((x: any) => x.id === id);
      found.severity = severityFound ? severityFound.value : this.severity[this.severity.length - 1]?.value;
    }
    return found;
  }
  refresh() {
    const temp = JSON.stringify(this.filteredNotes);
    this.filteredNotes = [];
    setTimeout(() => {
      this.filteredNotes = JSON.parse(temp); // to make sure it isnt a reference 
    }, 100); // this  time is given to ensure the list has completed all the edit or delete operations 
  }


  public downloadAsPDF() {
    const pdfTable = this.cardNote.el.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();

  }
}
