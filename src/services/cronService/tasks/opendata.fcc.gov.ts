import { CronJob } from "cron";
import { AbstractCronTask } from "../../../abstarcts/AbstractCronTask";

//таск для сервиса https://opendata.fcc.gov/resource/vakf-fz8e.json

class Opendata_Fcc_Gov_Task extends AbstractCronTask{

    job = new CronJob(
        '0 0 0 * * *', // cronTime
        this.handler, // onTick
        null, // onComplete
        false, // start
        'UTC+0' // timeZone
    );

    protected handler(): void {
        
    }
    
}
export default new Opendata_Fcc_Gov_Task();