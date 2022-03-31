import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, of, Subject } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { PopupMessageService } from '../component/popup-message/popup-message.service';
import { ScheduleRecord } from '../interfaces/schedule.interfaces';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService implements OnInit{

  private recordStream = new BehaviorSubject<ScheduleRecord[]>([]);

  /*
   * On client side unsaved records are assigned negative id. 
   * To sync it with newly assigned id temporary record in map will be created.
   */
  idMap = new Map<number, number>();

  selectedDate!: string;
  queuedDate!: string;


  constructor(
    private server: ServerService,
    private message: PopupMessageService
  ) { }


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
    .pipe(
      catchError(() => {
        this.message.warning("Can't get data from a server.");
        return of<ScheduleRecord[]>([]);
      })
    )
    .subscribe(responce => {
      this.recordStream.next(responce);
    })
  }

  confirmSwitch(){
    this.selectedDate = this.queuedDate;
  }

  changeTime(id: number, time: string){
    if(id > 0){
      this.server.updateRecordTime(id, time)
      .pipe(
        catchError(() => {
          this.message.warning("Connection error.");
          return of();
        })
      )
      .subscribe();

      return;
    }

    if(this.idMap.has(id)){
      this.server.updateRecordTime(<number>this.idMap.get(id), time)
      .pipe(
        catchError(() => {
          this.message.warning("Connection error.");
          return of();
        })
      )
      .subscribe();
    }
  }


  /**
   * Returns record id whan it gets assigned by server
   */
  updateRecord(id: number, time: string, text: string): Observable<number | null>{
    if(id > 0){
      this.server.updateRecordText(id, text)
      .pipe(
        catchError(() => {
          this.message.warning("Can't update record because of connection error.");
          return of()
        }),
        tap(() => {
          this.message.info("Record is updated.")
        })
      )
      .subscribe();
      return of(null);
    }

    return this.server.postRecord(this.selectedDate, time, text)
      .pipe(
        catchError( () => {
          this.message.warning("Can't save record because of connection error.");
          // Just complete
          return of<number>()
        }),
        tap( (serverID: number) => {
          this.message.info("Saved.");
          this.idMap.set(id, serverID);
          // Clean up
          setTimeout(() => {
            this.idMap.delete(id);
          },2000)
        })
      )
  }

  removeRecord(id: number){
    if(id <= 0){
      this.message.info("Deleted.");
      return
    }

    this.server.deleteRecord(id)
    .pipe(
      catchError(() => {
        this.message.warning("Connection error.");
        return of()
      }),
      tap(() => {
        this.message.info("Deleted.");
      })
    )
    .subscribe();
  }

}
