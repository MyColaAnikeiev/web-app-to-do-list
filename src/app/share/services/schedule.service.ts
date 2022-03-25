import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ScheduleRecord } from '../interfaces/schedule.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor() { }

  getRecordsStream(): Observable<ScheduleRecord[]>{
    return of([
      { id: 1, time: '07:30', text: 'Wake up.'},
      { id: 2, time: '10:45', text: 'Listen to dogs barking (Inevitable).' },
      { id: 3, time: '12:30', text: "Take a shower and don't return it anymore."},
      { id: 4, time: '15:05', text: 'Read a newspaper from Australia.'}
    ]);
  }

  

  changeTime(id: number, time: string){

  }

  changeText(id: number, text: string){

  }

  removeRecord(id: number){

  }
}
