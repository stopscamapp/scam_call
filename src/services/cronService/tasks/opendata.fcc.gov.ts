import { CronJob } from "cron";
import { AbstractCronTask } from "../../../abstarcts/AbstractCronTask";
import fs from 'node:fs';
import path from 'node:path';
import csvParser from "../../CSVParser/csvParser";
import { ICSVFields } from "../../../interfaces/ICSVFields";
import { IParserModelDto } from "../../../dto/parserModelDto";
import ScumNumbers, { ScumNumbersRow } from "../../../models/scamNumbers";
//таск для сервиса https://opendata.fcc.gov/resource/vakf-fz8e.json

class Opendata_Fcc_Gov_Task extends AbstractCronTask{

    job = new CronJob(
        '0 0 0 1 * *', // cronTime
        this.handler, // onTick
        null, // onComplete
        false, // start
        'UTC+0' // timeZone
    );

     async handler(): Promise<void> {
        try {
            const filePath = path.join(__dirname, 'test.csv');
            const fileStream = fs.createReadStream(filePath);
            const fields: ICSVFields={
                number:"Caller ID Number",
                numberRegExp:/^\d{3}-\d{3}-\d{4}$/,
                numberconverter:(number:string)=>"1"+(number.split("-").join("")),
                dateConverter:this.dateConverter,
                date:"Date of Issue",
                description:"Issue"
            }
            const data:IParserModelDto[] = await csvParser.fromStream(fileStream,fields);
            const BATCH_SIZE = 1000;
            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                const batch = data.slice(i, i + BATCH_SIZE);
                await ScumNumbers.bulkCreate(
                    batch.map(element=>({
                        [ScumNumbersRow.number]:element.number,
                        [ScumNumbersRow.description]:element.description,
                        [ScumNumbersRow.date]:element.date,
                    })),
                    {
                        ignoreDuplicates:true,
                        validate:true
                    }
                )
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }

    private dateConverter(dateStr:string|null):Date|null{
        if(dateStr==null){
            return null;
        }
        const [month, day, year] = dateStr.split('/');
        const m = Number(month);
        const d = Number(day);
        const y = Number(year);
        if (
            isNaN(m) || isNaN(d) || isNaN(y) ||
            m < 1 || m > 12 ||
            d < 1 || d > 31
        ) {
            return null;
        }
        return new Date(y, m - 1, d);
    }
    
}
export default new Opendata_Fcc_Gov_Task();