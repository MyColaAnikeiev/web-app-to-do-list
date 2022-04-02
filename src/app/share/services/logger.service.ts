import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoggerService{
    log(value: any){
        console.log(value);
    }

    err(value: any){
        console.log(value);
    }
}