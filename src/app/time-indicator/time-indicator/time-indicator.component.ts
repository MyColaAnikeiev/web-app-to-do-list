import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-indicator',
  templateUrl: './time-indicator.component.html',
  styleUrls: ['./time-indicator.component.scss']
})
export class TimeIndicatorComponent implements OnInit, OnDestroy, OnChanges {

  @Input('on') stateOn = true;

  public curTime = '00:00';
  private timeoutID: ReturnType<typeof setTimeout> | undefined;

  constructor() { }

  ngOnInit(): void {    
    this.runClock();
  }

  runClock(){
    this.stopClock();

    let date: Date;

    const update = () => {
      date = new Date();
      this.curTime = formatDate(date, 'HH:mm:ss', 'en-US');

      this.timeoutID = setTimeout(update, ( 1000 - date.getMilliseconds() % 1000));
    }

    update();
  }

  stopClock(){
    if(this.timeoutID != undefined){
      clearTimeout(this.timeoutID);
      this.timeoutID = undefined;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if( 'stateOn' in changes){
      const stateOn = changes['stateOn'].currentValue;
      if(stateOn){
        this.runClock();
      }else{
        this.stopClock();
      }
    }
  }

  ngOnDestroy(){
    this.stopClock();
  }

}
