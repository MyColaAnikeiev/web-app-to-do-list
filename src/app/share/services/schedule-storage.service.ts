import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { RecordI } from "../interfaces/server.interface";


@Injectable({
    providedIn: 'root'
})
export class ScheduleStorageService{
    private saver!: Subject<RecordI[]>;

    getRecords(): RecordI[]{
        try{
            const records = JSON.parse(localStorage.getItem('records') || '');
            return this.filterOlder(records);
        }catch(er){
            return [];
        }
    }


    saveRecords(records: RecordI[]){
        if(!this.saver){
            this.saver = new Subject();
            
            this.saver.pipe(
                debounceTime(1000)
            )
            .subscribe(records => {
                localStorage.setItem('records', JSON.stringify(records));
            })
        }

        this.saver.next(records);
    }

    /**
     * Clear schedule of any records that are for 4 days or more days ago. 
     * @param records 
     */
    private filterOlder(records: RecordI[]): RecordI[]{
        const date  = new Date();
        const dates: string[] = [];

        date.setDate(date.getDate()-3);
        for(let i = 0; i < 7; i++){
            dates.push(formatDate(date, 'dd-MM', 'en-US'));
            date.setDate(date.getDate()+1);
        }

        return records.filter(rec => dates.some(date => date == rec.date));
    }


}