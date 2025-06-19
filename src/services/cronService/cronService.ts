import { CronJob } from "cron";
import { AbstractCronTask } from "../../abstarcts/AbstractCronTask";
import Fts_Gov_Task from "./tasks/fts.gov";
import Opendata_Fcc_Gov_Task from "./tasks/opendata.fcc.gov";
import CreateDBFile from "./tasks/createDBFile";

//Tasks


class CronService{

    private tasks:Array<AbstractCronTask>= [
        //Fts_Gov_Task,
        CreateDBFile,
        //Opendata_Fcc_Gov_Task
    ]


    async startTasks(){
        for(let tsk of this.tasks){
            await tsk.handler();
            //tsk.start();
        }
    } 
}

export default new CronService();