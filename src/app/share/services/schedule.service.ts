import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ScheduleRecord } from '../interfaces/schedule.interfaces';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService implements OnInit{

  private recordStream = new BehaviorSubject<ScheduleRecord[]>([]);
  //private updateDate

  /*
   * On client side unsaved records are assigned negative id. 
   * To sync it with newly assigned id temporary record in map will be created.
   */
  idMap = new Map<number, number>();

  selectedDate!: string;
  queuedDate!: string;

  constructor(private server: ServerService) { }

  ngOnInit(): void {
  }

  getRecordsStream(): Observable<ScheduleRecord[]>{
    return this.recordStream;
  }

  switchDate(date: string){
    if(this.selectedDate === undefined){
      this.selectedDate = date;
      this.queuedDate = date;
    }else{
      this.queuedDate = date;
    }

    this.server.getRecordsByDate(date)
    .subscribe(responce => {
      this.recordStream.next(responce);
    })
  }

  confirmSwitch(){
    this.selectedDate = this.queuedDate;
  }

  changeTime(id: number, time: string){
    if(id > 0){
      this.server.updateRecordTime(id, time);
      return;
    }

    if(this.idMap.has(id)){
      this.server.updateRecordTime(<number>this.idMap.get(id), time);
    }
  }


  /**
   * Returns record id whan it gets assigned by server
   */
  updateRecord(id: number, time: string, text: string): Observable<number | null>{
    if(id > 0){
      this.server.updateRecordText(id, text);
      return of(null);
    }


    return this.server.postRecord(this.selectedDate, time, text)
      .pipe(
        tap( (serverID: number) => {
          this.idMap.set(id, serverID);
          // Clean up
          setTimeout(() => {
            this.idMap.delete(id);
          },2000)
        })
      )
  }

  removeRecord(id: number){
    this.server.deleteRecord(id);
  }
}
