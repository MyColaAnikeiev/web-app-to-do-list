import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { PopupMessage } from "./popup-message.interface";


@Injectable({
    providedIn: 'root'
})
export class PopupMessageService{

    msgStream = new Subject<PopupMessage>();

    info(text: string){
        this.msgStream.next({
            type: 'info',
            text
        })
    }

    warning(text: string){
        this.msgStream.next({
            type: 'warrning',
            text
        })
    }

    getMessageStream(): Observable<PopupMessage>{
        return this.msgStream;
    }

}