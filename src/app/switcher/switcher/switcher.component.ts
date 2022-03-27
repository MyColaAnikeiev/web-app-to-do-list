import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SwitcherService } from 'src/app/share/services/abstract-switcher.service';
import { ScheduleService } from 'src/app/share/services/schedule.service';


type buttonValue = {day: string, date: string};


@Component({
  selector: '.app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  providers: [
    {
      provide: SwitcherService,
      useExisting: ScheduleService
    }
  ]
})
export class SwitcherComponent implements OnInit {  
  public buttonValues: buttonValue[] = [];
  public currentDay = 'Mon';

  constructor(private schedule: SwitcherService) { }

  ngOnInit(): void {
    this.currentDay = (new Date()).toDateString().slice(0,3);
    this.buttonValues = this.genButtons();

    // Current day
    this.selectDay(3);
  }

  genButtons() : buttonValue[] {
    const date = new Date();
    date.setDate(date.getDate()-3);

    const days = [];

    for(let i = 0; i < 7; i++){
      const dateString = formatDate(date, 'dd-MM','en-US');
      const dayName = date.toDateString().slice(0,3);
      date.setDate(date.getDate()+1);
      days.push({ day: dayName, date: dateString });
    }

    return days;
  }

  selectDay(index: number){
    this.currentDay = this.buttonValues[index].day;
    this.schedule.switchDate(this.buttonValues[index].date);
  }

}
