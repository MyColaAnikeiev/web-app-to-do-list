import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { PopupMessage } from "./popup-message.interface";


@Injectable({
    providedIn: 'root'
})
export class PopupMessageService{

    getMessageStream(): Observable<PopupMessage>{
        return of();
    }

}