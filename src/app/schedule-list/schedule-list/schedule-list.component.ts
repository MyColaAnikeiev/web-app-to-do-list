import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { RecordStateModelI } from 'src/app/share/interfaces/schedule.interfaces';
import { ScheduleService } from 'src/app/share/services/schedule.service';
import { debounceTime, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs';
import { RecordTime } from 'src/app/share/lib/record-time';


@Component({
  selector: '.app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleListComponent implements OnInit {
  clockStateOn = true;

  recordsStates : RecordStateModelI[] = [];

  recordsForm = new FormArray([]);
  recordsGroup = new FormGroup({
    records: this.recordsForm
  });

  unsavedIdCount = 0;

  constructor(private scheduleServ: ScheduleService) { 
  }

  ngOnInit(): void {

    this.scheduleServ.getRecordsStream()
    .subscribe(records => {
      this.clearSchedule();
      this.recordsStates = records.map( (record, index) => {
        return {
          id: record.id,
          time: new RecordTime(record.time),
          text: record.text,
          position: index+1, 
          control: null, 
          controlUnsubscriber: new Subject() 
        }
      });
      this.recordsStates.forEach(mod => this.addRecordFromModel(mod) )
    })

  }

  clearSchedule(){

  }

  /**
   * Adding new record from template event.
   * @param focus - on what to focus when added.
   */
  addRecord(focus: 'time' | 'text'){
    const time = this.findVacantTime();
    debugger

    const mod: RecordStateModelI = {
      id: --this.unsavedIdCount,
      position: this.recordsStates.length+1,
      time,
      text: '',
      control: null,
      controlUnsubscriber: new Subject()
    }

    this.recordsStates.push(mod);
    this.addRecordFromModel(mod);
    this.sortRecords();

    setTimeout(() => {
      const records = document.getElementsByClassName('record-editable');

      if(records.length){
        const lastRecord = records[records.length-1];

        if(focus == 'time'){
          (lastRecord.querySelector('[formControlName=time] > input') as HTMLInputElement).focus();
        }else{
          (lastRecord.querySelector('[formControlName=text]') as HTMLInputElement).focus();
        }

      }
    }, 0);

  }

  findVacantTime(): RecordTime{
    const time = new RecordTime('07:00');

    if(this.recordsStates.length == 0){
      return time;
    }

    // If there is any records, try to take largest time value and increase it.
    // recordStates shoud be sorted
    time.setTime(this.recordsStates[this.recordsStates.length-1].time);
    let {hr} = time;
    time.addMin(5);

    // If not overflowing, return it
    if(time.hr >= hr){
      return time;
    }

    // Search beckwards with step value of 1
    time.setTime('23:59');
    while(this.checkIfTimeIsUsed(time)){
      time.addMin(-1);
    }

    return time;
  }

  checkIfTimeIsUsed(time: RecordTime): boolean{
    const tmStr = time.toString();
    return this.recordsStates.some(mod => mod.time.toString() == tmStr);
  }

  addRecordFromModel(model: RecordStateModelI){
    const timeControl = new FormControl(model.time.toString());
    const textControl = new FormControl(model.text);
    const recordGroup = new FormGroup({
      time: timeControl,
      text: textControl
    })
    model.control = recordGroup;
    this.recordsForm.push(recordGroup);

    this.setupRecordTimeHandler(model,timeControl);
  }

  deleteRecord(id: number){
    const recInd = this.recordsStates.findIndex(model => model.id == id);

    if(recInd != -1){
      const model = this.recordsStates[recInd];
      const unsubscriber = model.controlUnsubscriber;
      unsubscriber.next();
      unsubscriber.complete();

      // Request to delete record at server
      this.scheduleServ.removeRecord(id);

      // controls in array could be sorted differently than recordsStates
      const controlIndex = this.recordsForm.controls.findIndex(control => control == model.control);
      this.recordsForm.controls.splice(controlIndex, 1);
      this.recordsStates.splice(recInd, 1);
      
      this.sortRecords();
    }
  }

  setupRecordTimeHandler(model: RecordStateModelI, timeControl: FormControl){
    timeControl.valueChanges
    .pipe(
      debounceTime(1000),
      takeUntil(model.controlUnsubscriber)
    )
    .subscribe((time: string) => {
      if(model.time.toString() == time){
        return;
      }
      
      if(this.checkIfTimeIsUsed(new RecordTime(time))){
        timeControl.setValue(String(model.time));
        return;
      }

      model.time.setTime(time);
      // Check if out of range 
      if(model.time.toString() != time){
        timeControl.setValue(model.time.toString());
      }
      this.scheduleServ.changeTime(model.id, time);
      this.sortRecords();
    })
  }

  setupRecordTextHandler(model: RecordStateModelI, textControl: FormControl){
    textControl.valueChanges
    .pipe(
      debounceTime(5000),
      takeUntil(model.controlUnsubscriber)
    )
    .subscribe(text => {
      if(model.text == text){
        return;
      }

      model.text = text;
      this.scheduleServ.changeText(model.id, text);
    })
  }

  sortRecords(){
    // this.recordsStates should be syncronized with this.recordsForm array
    // so we need to copy in before sorting 
    const copy = [...this.recordsStates];

    copy.sort((a,b) => {
      return a.time.getTotalMinutes() - b.time.getTotalMinutes();
    })

    copy.forEach((mod, ind) => mod.position = ind+1);
  }
}
