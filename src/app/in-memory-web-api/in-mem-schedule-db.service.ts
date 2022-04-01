import { InMemoryDbService } from 'angular-in-memory-web-api'
import { Observable } from 'rxjs';
import { RecordI } from 'src/app/share/interfaces/server.interface'
import { dummyRecords } from './dummy.database'
import { RequestInfo } from 'angular-in-memory-web-api'

export class InMemScheduleDbService implements InMemoryDbService{

    records: RecordI[] = [];

    constructor(){}

    createDb(){
        this.records = [...dummyRecords];

        return { records: this.records }
    }

    /**
     * Look out for /date/:date where :date is in dd:MM format
     */
    get(req: RequestInfo): null | Observable<any>{
        const reqlocation = req.utils.getLocation(req.url);
        const parts = reqlocation.relative.split('/');
        if(parts.length < 1){
            return null;
        }

        const last = parts.pop();
        const sec = parts.pop();
        if(sec == 'date'){
            const body = this.records.filter(rec => rec.date == last);
            return req.utils.createResponse$(() => ({
                body,
                status: 200
            }));
        }

        return null;
    }

    /**
     * Added patch support
     */
    patch(req: RequestInfo): Observable<any> | null{
        
        if(req.collectionName == 'records'){
            const {id} = req;
            const body = (req.req as any).body as { time?: string, text?: string };

            if(!body){
                return null;
            }

            if(body.time){
                const {time} = body;

                this.records.forEach(rec => {
                    if(rec.id == id){
                        rec.time = time
                    }
                })
            }

            if(body.text){
                const {text} = body;

                this.records.forEach(rec => {
                    if(rec.id == id){
                        rec.text = text
                    }
                })
            }

            return req.utils.createResponse$(() => ({status: 200}));
        }

        return null;
    }
}