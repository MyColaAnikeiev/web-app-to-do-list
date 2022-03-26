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

    const mod: RecordStateModelI = {
      id: -1,
      position: this.recordsStates.length+1,
      time: new RecordTime(this.recordsStates.length ? this.recordsStates[this.recordsStates.length-1].time : '00:00'),
      text: '',
      control: null,
      controlUnsubscriber: new Subject()
    }

    this.recordsStates.push(mod);
    this.addRecordFromModel(mod);

    setTimeout(() => {
      const records = document.getElementsByClassName('record-editable');
      debugger;
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

  addRecordFromModel(model: RecordStateModelI){
    const timeControl = new FormControl(model.time);
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
    this.recordsStates.sort((a,b) => {
      return a.time.getTotalMinutes() - b.time.getTotalMinutes();
    })

    this.recordsStates.forEach((mod, ind) => mod.position = ind+1);
  }
}
