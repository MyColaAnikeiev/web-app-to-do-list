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
            return records;
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

}