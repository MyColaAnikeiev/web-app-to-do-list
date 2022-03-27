import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
/*
 * Service for binding all records and schedule list as a whole
 */
export class ShafleAnimatonBindingService{
    // Used when new instance of ListShafleAnimationDirective is created
    public startingRow = 1;

    // All newly added records will apear instantly in according to
    //  assigned row position
    instantMode(){
        this.startingRow = -1;
    }

    spreadMode(startingRow: number = 1){
        this.startingRow = startingRow;
    }
}