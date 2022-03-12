import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Globals } from 'src/app/models/Globals';
import { NotesService } from 'src/app/services/notes.service';
declare var moment: any;
@Component({
  selector: 'app-calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.scss']
})
export class CalendarGridComponent implements OnInit {
  weekNumber: number = 1;
  maxWeekNumber: number = Globals.MAXWEEK;
  minWeekNumber: number = Globals.MINWEEK;
  weekDates: any = [];
  labels: any = [];
  type: number = 0;
  countWeeks = 1;
  isBusy = false;
  isDarkMode = false;
  constructor(public notesService: NotesService, private el: ElementRef, private renderer: Renderer2) {
    this.getNotesandLabels();
  }
  ngOnInit(): void {
  }
  getNotesandLabels() {
    this.isBusy = true;
    forkJoin([this.notesService.getNoteLabels(), this.notesService.getNotes()])
      .subscribe((res: any) => {
        this.getWeekDaysByWeekNumber();
        this.isBusy = false;
        this.labels = res[0];
        this.notesService.allLabels = res[0];
        this.notesService.allNotes = res[1].notes;
        // we get the notes at start and pass it to the child component where it will filter and render accordingly. 
      });
  }
  getWeekDaysByWeekNumber() {
    const startDate = new Date(1970, 0, 1 + ((this.weekNumber - 1) * 7)); // the data received has dates in 1970
    let date = moment(startDate).isoWeek(this.weekNumber || 1).startOf("week");
    let weeklength = Globals.DAYSINWEEK;
    let finalDateList = '';
    while (weeklength--) {
      const day = parseInt(date.day());
      if (day > Globals.WEEKENDMIN && day < Globals.WEEKENDMAX) { // we dont want weekends --only saturday and sunday is considered weekend here
        finalDateList += date._d.toString() + ',';
      }
      date = date.add(1, "day");
    }

    finalDateList = finalDateList.trim().substring(0, finalDateList.length - 1);;
    this.weekDates = finalDateList.split(',');
    return this.weekDates;
  }

  updateWeek(mode: string) {
    this.weekDates = [];
    if (mode === 'add' && this.weekNumber <= this.maxWeekNumber) {
      this.weekNumber = ++this.weekNumber; // go to next week but not more than max week limit
    } else if (mode === 'subtract' && this.weekNumber >= this.minWeekNumber) {
      this.weekNumber = --this.weekNumber; // go to prev week but not less than min week limit
    }
    this.countWeeks++;
    if (this.countWeeks == 3) {
      this.notesService.getNotes().subscribe((res: any) => {
        this.notesService.allNotes = res.notes;
        this.countWeeks = 1;
        this.getWeekDaysByWeekNumber(); // reload the grid again with the latest weeknumber dates
        return;
      });
    }
    this.getWeekDaysByWeekNumber();
  }
  typeChange() {
    this.type = parseInt(this.type.toString(), 10)
    if (this.type == 0) {
      this.labels = this.notesService.allLabels;
      return;
    }
    this.labels = this.notesService.allLabels.filter((x: any) => x.id === this.type);
  }
  setBusy(event: any) {
    this.isBusy = event;
  }
  darkModeChange() {
    this.isDarkMode = !this.isDarkMode;
    this.isDarkMode === false ? this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'backgroundColor', 'white')
      : this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'backgroundColor', '#424242');
  }
}
