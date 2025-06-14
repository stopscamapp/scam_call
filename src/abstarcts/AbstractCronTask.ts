import { CronJob } from 'cron';

export abstract class AbstractCronTask {
    abstract job: CronJob;
    abstract handler(): Promise<void>;
    public start() {
        this.job.start();
        console.log(this.job);
        console.log("JOB started");
        
    }
}