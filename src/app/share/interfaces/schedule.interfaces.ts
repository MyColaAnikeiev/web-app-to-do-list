import { AbstractControl } from "@angular/forms";
import { Subject } from "rxjs";

export interface ScheduleRecord{
    id: number;
    time: string;
    text: string;
}

export interface RecordStateModelI{
    id: number;
    time: string;
    text: string;
    position: number;
    control: AbstractControl | null;
    controlUnsubscriber: Subject<any>
}