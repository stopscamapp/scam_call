import { CronJob } from "cron";
import { AbstractCronTask } from "../../../abstarcts/AbstractCronTask";

//таска для парсинга с сервиса https://www.ftc.gov/policy-notices/open-government/data-sets/do-not-call-data

class Fts_Gov_Task extends AbstractCronTask{

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
export default new Fts_Gov_Task();