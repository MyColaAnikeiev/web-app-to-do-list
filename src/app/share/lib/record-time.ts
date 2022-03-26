
export class RecordTime{
    // Hours and minutes
    dateObject!: Date;

    /**
     * 
     * @param timeString - string formated as 'HH:mm' or other RecordTime instance
     */
    constructor(time: string | RecordTime){
        this.setTime(time);
    }

    /**
     * 
     * @param time - accepts string in format 'HH:mm' but it fail safe for string.
     * On string read failure to will write zeros, and when out of range (00:00-23:59) it 
     * will be croped to it. Also accepts other RecordTime object to create instance from.
     */
    setTime(time: string | RecordTime){
        if(typeof time == 'string'){
            this.dateObject = new Date();

            let hr = Number(time.slice(0,2));
            let min = Number(time.slice(3,5));

            // Check for string to number convertion failure
            hr = isFinite(hr) ? hr : 0;
            min = isFinite(min) ? min : 0;
            
            this.dateObject.setMinutes( this.cropToRange(min,0,59) );
            this.dateObject.setHours( this.cropToRange(hr, 0, 23) ); 
        }
        else if(time instanceof RecordTime){
            this.dateObject = new Date(time.dateObject)
        }
    }

    toString(){
        return this.dateObject.toTimeString().slice(0,5);
    }

    addMin(min: number){
        this.dateObject.setMinutes(this.dateObject.getMinutes() + min);
    }

    addHours(hr: number){
        this.dateObject.setHours(this.dateObject.getHours() + hr);
    }

    /**
     * Return total minutes counted from 00:00
     */
    getTotalMinutes(){
        return this.dateObject.getHours()*60 + this.dateObject.getMinutes();
    }

    cropToRange(val: number, min: number, max: number): number{
        if(val < min){
            val = min;
        }
        if(val > max){
            val = max;
        }
        return val;
    }
}
