import { CronJob } from 'cron';

export abstract class AbstractCronTask {
    protected  abstract job: CronJob;
    protected  abstract handler(): void;
    public start() {
        this.job.start();
    }
}