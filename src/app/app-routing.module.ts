import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarGridComponent } from './controls/calendar-grid/calendar-grid.component';

const routes: Routes = [
  { path: '', component: CalendarGridComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
