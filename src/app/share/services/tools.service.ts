import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  fromTimeStringToObject(tmStr: string){
    let hr = Number(tmStr.slice(0,2));
    let min = Number(tmStr.slice(3,5));
    hr = isFinite(hr) ? hr : 0;
    min = isFinite(min) ? min : 0;
    return { hours: hr, minutes: min };
  }

  fromTimeStringToMin(tmStr: string){
    const time = this.fromTimeStringToObject(tmStr);
    return time.hours*60+time.minutes;
  }
}
