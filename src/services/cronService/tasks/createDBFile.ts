import { CronJob } from "cron";
import { AbstractCronTask } from "../../../abstarcts/AbstractCronTask";
import ScumNumbers from "../../../models/scamNumbers";
import fs from 'fs';
import path from "path";

class CreateDBFile extends AbstractCronTask{
    job = new CronJob(
            '0 0 19 * * *', // cronTime
            this.handler, // onTick
            null, // onComplete
            false, // start
            'UTC+0' // timeZone
        );
    async handler(): Promise<void> {
        try {
            const DIR = path.resolve(__dirname, '../../../var');
            console.log(DIR);
            
            const OUT = path.join(DIR, 'numbers.ndjson');      // …/src/var/numbers.ndjson
            const TMP = path.join(DIR, 'numbers.tmp'); 

            const rows = await ScumNumbers.findAll({
                order: [['id', 'ASC']],                   // для стабильности
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                raw: true                                 // plain-объекты
            });
            const tmp = fs.createWriteStream(TMP, { flags: 'w' });
            for (const r of rows) {
                tmp.write(JSON.stringify(r) + '\n');      // {"id":…,"number":…}\n
            }

            await new Promise<void>((resolve, reject) => {
                tmp.end(resolve);
                tmp.on('error', reject);
            });

            await fs.promises.rename(TMP, OUT);
        } catch (error) {
            console.log(error);
            
        }
    }
}

export default new CreateDBFile();