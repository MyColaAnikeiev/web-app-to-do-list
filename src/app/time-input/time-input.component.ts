import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time-input',
  template: '<input type="text" #input [disabled]="disabled != undefined" (input)="valueChange($event)">',
  styleUrls: ['./time-input.component.scss'],
  providers : [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    }
  ]
})
export class TimeInputComponent implements OnInit, AfterViewInit, ControlValueAccessor{

  @Input('disabled') disabled: string | undefined;

  @ViewChild('input') inputEl!: ElementRef;

  time = '00:00';

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.inputEl.nativeElement.value = this.time;
  }

  valueChange(evt_: Event){
    const evt = evt_ as InputEvent;
    const target = evt.target as HTMLInputElement;
    const {value} = target;

    const selStart = target.selectionStart;
    const selEnd = target.selectionEnd;

    if(this.timeIsCorrect(value)){
      this.time = value;
      target.value = this.time;
      target.setSelectionRange(selStart,selEnd);
      this.onChange(value);
      this.onTouched(value);
      return;
    }

    if(value.length == 6 && selStart != null && selEnd != null){
      const tm = value.slice(0,selStart) + value.slice(selStart+1);

      if(this.timeIsCorrect(tm)){
        this.time = tm; 
        this.onChange(tm);
        this.onTouched(tm);
      }
    }

    target.value = this.time;
    target.setSelectionRange(selStart,selEnd);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(time: any): void {
    this.time = time;
    if(this.inputEl){
      this.inputEl.nativeElement.value = time;
    }   
  }

  hrMinFromStr(tm: string){
    const h = Number(tm.slice(0,2));
    const m = Number(tm.slice(3,5));
    return { hours: h, minutes: m };    
  }

  /* Format HH:mm */
  timeIsCorrect(tm: string): boolean{
    if(tm.length != 5 || tm[2] != ':'){
      return false;
    }

    const {hours: h, minutes: m} = this.hrMinFromStr(tm);
    if(!isFinite(h) || !isFinite(m)){
      return false;
    }

    if(h < 0 || m < 0 || h > 23 || m > 59){
      return false;
    }

    return true;
  }
  
}
