
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

    setTime(time: string | RecordTime){
        if(typeof time == 'string'){
            this.dateObject = new Date();
            let hr = 0, min = 0;

            hr = Number(time.slice(0,2));
            min = Number(time.slice(3,5));

            this.dateObject.setMinutes ( isFinite(min) ? min : 0 );
            this.dateObject.setHours( isFinite(hr) ? hr : 0 ); 
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
}
