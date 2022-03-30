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
        const fn = () => {
            if(Math.random() > 0.5){
                this.msgStream.next({
                    type: 'info',
                    text: 'Saved.'
                })
            }else{
                this.msgStream.next({
                    type: 'warrning',
                    text: 'Server error. Check your internet conetcion.'
                })
            }

            setTimeout(fn, 400 + 1300);
        }

        return this.msgStream;
    }

}