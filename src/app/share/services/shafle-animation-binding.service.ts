import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
/*
 * Service to globaly control each ListShafleAnimationDirective instanceses.
 */
export class ShafleAnimatonBindingService{
    // Used when new instance of ListShafleAnimationDirective is created
    public startingRow = 1;

    private _interval = 1000.0/30; // 30 fps
    private _animationHandlers: Set<() => void> = new Set();
    private _intervalID: ReturnType<typeof setInterval> | null = null;

    // All newly added records will apear instantly in according to
    //  assigned row position
    instantMode(){
        this.startingRow = -1;
    }

    spreadMode(startingRow: number = 1){
        this.startingRow = startingRow;
    }

    registerAnimation(fn: () => void){
        this._animationHandlers.add(fn);

        if(this._intervalID === null){
            this._intervalID = setInterval(() => {
                this._animationHandlers.forEach(handler => handler());
            }, this._interval);
        }
    }    

    unregisterAnimation(fn: (() => void) | null){
        if(fn !== null){
            this._animationHandlers.delete(fn);
        }

        if(this._animationHandlers.size == 0 && this._intervalID !== null){
            clearInterval(this._intervalID)
            this._intervalID = null;
        }
    }
}