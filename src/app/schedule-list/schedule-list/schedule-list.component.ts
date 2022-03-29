import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { RecordStateModelI } from 'src/app/share/interfaces/schedule.interfaces';
import { ScheduleService } from 'src/app/share/services/schedule.service';
import { debounce, delay, delayWhen, takeUntil, tap } from 'rxjs/operators'
import { interval, merge, of, Subject, timer } from 'rxjs';
import { RecordTime } from 'src/app/share/lib/record-time';
import { ShafleAnimatonBindingService } from 'src/app/share/services/shafle-animation-binding.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: '.app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('recordAppearDisappear', [
      state('void', style({ opacity: 0 })),
      state('shown', style({ opacity: 1 })),
      transition('void => *', animate('0.4s'))
    ])
  ]
})
export class ScheduleListComponent implements OnInit {
  clockStateOn = true;

  recordsStates : RecordStateModelI[] = [];

  recordsForm = new FormArray([]);
  recordsGroup = new FormGroup({
    records: this.recordsForm
  });

  unsavedIdCount = 0;

  switchSubject: Subject<any> = new Subject();

  constructor(
    private scheduleServ: ScheduleService, 
    private animationBinding: ShafleAnimatonBindingService
  ) {}

  ngOnInit(): void {

    this.scheduleServ.getRecordsStream()
    .pipe(
      // Force debounced changes to finish erlier
      tap(() => this.switchSubject.next())
    )
    .subscribe(records => {
      this.animationBinding.spreadMode();
      this.clearSchedule();
      this.scheduleServ.confirmSwitch();

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

      this.recordsStates.forEach(mod => this.addRecordFromModel(mod) );

      this.sortRecords();
    })

  }

  clearSchedule(){
    this.recordsStates.forEach(mod => {
      mod.controlUnsubscriber.next();
      mod.controlUnsubscriber.complete();
    });

    this.recordsStates = [];
    this.recordsForm.clear();
  }

  /**
   * Adding new record from template event.
   * @param focus - on what to focus when added.
   */
  addRecord(focus: 'time' | 'text'){
    this.animationBinding.instantMode();
    const time = this.findVacantTime();

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
    // recordsStates itself should'n be sorted
    const copy = [...this.recordsStates];
    copy.sort((a,b) => {
      return a.time.getTotalMinutes() - b.time.getTotalMinutes();
    })
    time.setTime(copy[copy.length-1].time);
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
    this.setupRecordTextHandler(model, textControl);
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

      const controlIndex = this.recordsForm.controls.findIndex(control => control == model.control);
      this.recordsForm.controls.splice(controlIndex, 1);
      this.recordsStates.splice(recInd, 1);

      this.sortRecords();
    }
  }

  setupRecordTimeHandler(model: RecordStateModelI, timeControl: FormControl){
    timeControl.valueChanges
    .pipe(
      debounce(() => {
        return merge(interval(1000), this.switchSubject);
      }),
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
      debounce(() => {
        return merge(timer(5000), this.switchSubject);
      }),
      takeUntil(model.controlUnsubscriber)
    )
    .subscribe(text => {
      if(model.text == text){
        return;
      }

      model.text = text;
      this.scheduleServ.updateRecord(model.id, model.time.toString(), text)
        .subscribe(id => {
          if(id !== null){
            // Assigned by server
            model.id = id;
          }
        })
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
