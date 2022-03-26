import { AbstractControl } from "@angular/forms";
import { Subject } from "rxjs";
import { RecordTime } from "../lib/record-time";

export interface ScheduleRecord{
    id: number;
    time: string;
    text: string;
}

export interface RecordStateModelI{
    id: number;
    time: RecordTime;
    text: string;
    position: number;
    control: AbstractControl | null;
    controlUnsubscriber: Subject<any>
}