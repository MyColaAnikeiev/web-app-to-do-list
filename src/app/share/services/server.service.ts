import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ServerConfigI, SERVER_CONFIG } from "src/app/app.config";
import { RecordI } from "../interfaces/server.interface";


@Injectable({
    providedIn: 'root'
})
export class ServerService{

    constructor(
        @Inject(SERVER_CONFIG) private config: ServerConfigI, 
        private http: HttpClient
    ){}

    getRecordsByDate(date: string): Observable<RecordI[]>{
        return this.http.get<RecordI[]>(this.config.apiPath + '/date/' + date)
            .pipe(
                map(res => res ? res : [])
            );
    }

    deleteRecord(id: number){
        this.http.delete(this.config.apiPath + '/records/' + String(id))
            .subscribe();
    }

    updateRecordTime(id: number, time: string){
        this.http.patch(this.config.apiPath + '/records/' + String(id), {time})
            .subscribe();
    }

    updateRecordText(id: number, text: string){
        this.http.patch(this.config.apiPath + '/records/' + String(id), {text})
            .subscribe();
    }

    /*
     *  Returns assigned id
     */
    postRecord(date: string, time: string, text: string): Observable<number>{
        return this.http.post<RecordI>(this.config.apiPath + '/records/', 
            {date, time, text}
        ).pipe(
            map(res => res.id)
        )
    }
}