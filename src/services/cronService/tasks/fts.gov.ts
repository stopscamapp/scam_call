import { CronJob } from "cron";
import { AbstractCronTask } from "../../../abstarcts/AbstractCronTask";
import fs from 'node:fs';
import path from 'node:path';
import { ICSVFields } from "../../../interfaces/ICSVFields";
import ScumNumbers, { ScumNumbersRow } from "../../../models/scamNumbers";
import { IParserModelDto } from "../../../dto/parserModelDto";
import csvParser from "../../CSVParser/csvParser";
import httpService from "../../httpService/httpService";
import DTFtcGovConfig, { DTFtcGovConfigRow, LAST_DATE_KEY } from "../../../models/fts_gov_config";
import { format } from "date-fns/format";

//таска для парсинга с сервиса https://www.ftc.gov/policy-notices/open-government/data-sets/do-not-call-data

class Fts_Gov_Task extends AbstractCronTask{

    job = new CronJob(
        '0 0 19 * * *', // cronTime
        this.handler, // onTick
        null, // onComplete
        false, // start
        'UTC+0' // timeZone
    );




     async handler(): Promise<void> {
        try {
            const congfig = await DTFtcGovConfig.findOne({
                where:{
                   [DTFtcGovConfigRow.key]:LAST_DATE_KEY
                }
            })
            let startDate:Date;
            let endDate:Date = new Date();
             
            if(congfig==null){
                startDate=this.defaultStartDate;
            }else{
                try {
                    startDate= new Date(congfig.value)
                } catch (error) {
                    console.log(error);
                    startDate=this.defaultStartDate;
                }
            }
            startDate.setDate(startDate.getDate() - 2);
            const dates = this.generateDates(startDate,endDate)
            console.log(dates.length);
            

            const fields: ICSVFields={
                number:"Company_Phone_Number",
                numberconverter:(number:string)=>"1"+number,
                date:"Violation_Date",
                description:"Issue"
            }

            for (const date of dates){
                const formattedDate = format(date, 'yyyy-MM-dd');
                const url = `https://www.ftc.gov/sites/default/files/DNC_Complaint_Numbers_${formattedDate}.csv`;
                const stream = await httpService.downloadAsStream(url,this.headers);
                if(stream==null){
                    console.log("stream null");
                    
                    continue;
                }
                const data:IParserModelDto[] = await csvParser.fromStream(stream,fields);
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
            }
            
            if(congfig==null){
                await DTFtcGovConfig.create({
                    [DTFtcGovConfigRow.key]:LAST_DATE_KEY,
                    [DTFtcGovConfigRow.value]:endDate.toDateString()
                })
            }else{
                await DTFtcGovConfig.update(
                    {
                        [DTFtcGovConfigRow.value]:endDate.toDateString()
                    }
                    ,
                    {
                       where:{
                            [DTFtcGovConfigRow.key]:LAST_DATE_KEY,
                       } 
                    }
                );
            }
            
            
        } catch (error) {
            console.log(error);
            
        }
    }

    private generateDates = (startDate: Date, endDate: Date): Date[] => {
        const dates: Date[] = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    private headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Cookie': '_ga=GA1.1.1294945875.1749688914; _ga_CSLL4ZEK4L=GS2.1.s1749827130$o2$g0$t1749827145$j45$l0$h0; _ga_B59RVWNH5N=GS2.1.s1749827130$o2$g0$t1749827145$j45$l0$h0'
                }
    
    private defaultStartDate = new Date('2024-01-01')

    
    
}
export default new Fts_Gov_Task();