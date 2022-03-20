import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header/header.component';
import { SwitcherComponent } from './switcher/switcher/switcher.component';
import { ScheduleListComponent } from './schedule-list/schedule-list/schedule-list.component';
import { TimeIndicatorComponent } from './time-indicator/time-indicator/time-indicator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeInputComponent } from './time-input/time-input.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SwitcherComponent,
    ScheduleListComponent,
    TimeIndicatorComponent,
    TimeInputComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
