import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';


type buttonValue = {day: string, date: string};


@Component({
  selector: '.app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss']
})
export class SwitcherComponent implements OnInit {  
  public buttonValues: buttonValue[] = [];
  public currentDay = 'Mon';

  constructor() { }

  ngOnInit(): void {
    this.currentDay = (new Date()).toDateString().slice(0,3);

    this.buttonValues = this.genButtons();
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
  }

}
