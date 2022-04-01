import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header/header.component';
import { SwitcherComponent } from './switcher/switcher/switcher.component';
import { ScheduleListComponent } from './schedule-list/schedule-list/schedule-list.component';
import { TimeIndicatorComponent } from './time-indicator/time-indicator/time-indicator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeInputComponent } from './time-input/time-input.component';
import { ListShafleAnimationDirective } from './share/directives/list-shafle-animation.directive';
import { PopupMessageComponent } from './share/component/popup-message/popup-message.component';
import { InMemScheduleDbService } from './in-memory-web-api/in-mem-schedule-db.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SwitcherComponent,
    ScheduleListComponent,
    TimeIndicatorComponent,
    TimeInputComponent,
    ListShafleAnimationDirective,
    PopupMessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemScheduleDbService, {apiBase: '/', delay: 50}
    ),
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
