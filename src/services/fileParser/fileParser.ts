import fs from 'node:fs';
import path, { resolve } from 'node:path';
import * as fast from 'fast-csv';
import { IParserModelDto } from '../../dto/parserModelDto';
import axios from 'axios';
import { Readable } from 'node:stream';
import { format } from 'date-fns';
class FileParser{
    
    async parseCSV(){
        console.time('CSV_Parsing');
        const result =  await this._parseCSV();
        console.timeEnd('CSV_Parsing');
        //console.log(result);
        console.log(result.length);
    }
   

    async _parseCSV(){
        return new Promise<IParserModelDto[]>((resolve,reject)=>{
            
            const filePath = path.join(__dirname, 'files/base.csv');
            const fileStream = fs.createReadStream(filePath);
            
            let records:IParserModelDto[] = [];
            let isNeededReserv = false;
            const regex = /^\d{3}-\d{3}-\d{4}$/;

            let rowCount = 0;
            fileStream
            .pipe(fast.parse({ headers: true })) // `headers: true` автоматически использует первую строку как заголовки
            .on('error', error => {
                // Отклоняем промис при ошибке
                reject(new Error(`Ошибка парсинга CSV файла "${filePath}": ${error.message}`));
            })
            .on('data', async row => {
                 // Увеличиваем счетчик при каждой новой строке данных
                rowCount++;
                console.log(rowCount);
                const number =  row["Caller ID Number"]
                if(regex.test(number)){
                    
                    const dateString =  row["Date of Issue"]
                    const [month, day, year] = dateString.split("/");
                    if(month&&day&&year && (year=="2025"||year=="2024")){
                        const date = new Date(year, month - 1, day);
                        const  numberStr ="1"+(number.split("-").join(""));
                        const description=row["Issue"]??"not";
                        const csum:IParserModelDto = {
                            number : numberStr,
                            description:description,
                            date:date
                        }
                        records.push(csum);
                        
                        
                        
                    }
                    
                }
                
                
            })
            .on('end', async() => {
                // Разрешаем промис, когда все данные прочитаны
                console.log(`Прочитано ${records.length} строк из "${filePath}".`);
                resolve(records);
            });
        })
        
    }

    
     async parseCSVsite(){
        console.time('CSV_Parsing_site');
        const result =  await this._parseCSVsite();
        console.timeEnd('CSV_Parsing_site');
        //console.log(result);
        //console.log(result.length);
    }

    results : Map<string,Date> = new Map<string,Date>();
    rowCount : number = 0;
    async _parseCSVsite(){
        const startDate = new Date('2024-01-01');
        const endDate = new Date();
        const dates = this.generateDates(startDate,endDate)

        for (const date of dates){
            const formattedDate = format(date, 'yyyy-MM-dd');
            const url = `https://www.ftc.gov/sites/default/files/DNC_Complaint_Numbers_${formattedDate}.csv`;
            const fileStream = await this._parseCSVsiteStriam(url);
            if(fileStream!=null){
                try {
                    await this.processCSV(fileStream);
                } catch (error) {
                    console.log(error);
                    
                }
            }
        }
       console.log(this.rowCount);
       console.log(this.results.size);
        
    }

    generateDates = (startDate: Date, endDate: Date): Date[] => {
        const dates: Date[] = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    private async _parseCSVsiteStriam(url:string):Promise<Readable|null>{
        try {
            const response = await axios.get(
                url,
                {
                    responseType:'stream',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'DNT': '1',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1',
                        'Cookie': '_ga=GA1.1.1294945875.1749688914; _ga_CSLL4ZEK4L=GS2.1.s1749827130$o2$g0$t1749827145$j45$l0$h0; _ga_B59RVWNH5N=GS2.1.s1749827130$o2$g0$t1749827145$j45$l0$h0'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return null;
        }
    }

     processCSV = async (stream: Readable) => {
        return new Promise((resolve,reject)=>{
            stream
            .pipe(fast.parse({ headers: true })) // `headers: true` автоматически использует первую строку как заголовки
            .on('error', error => {
                // Отклоняем промис при ошибке
                reject(new Error(`Ошибка`));
            })
            .on('data', async row => {
                 // Увеличиваем счетчик при каждой новой строке данных
                this.rowCount++;
                console.log(this.rowCount);
                const number =  row["Company_Phone_Number"]
                const dateInMilliseconds  = Date.parse(row["Violation_Date"]);
                const date = new Date(dateInMilliseconds);  
                if(date.getFullYear()==2025||date.getFullYear()==2024){
                    const find =  this.results.get(number);
                    if(find==null){
                        this.results.set(number,date);
                    }else{
                        // if(povtor.length>0){
                        //     return;
                        // }
                        // allRow.forEach((el)=>{
                        //     if(el["Company_Phone_Number"]==number){
                        //         povtor.push(el)
                        //         povtor.push(row)
                        //     }
                            
                        // })
                        
                    }   
                    }
                
                
            })
            .on('end',() => {
                // Разрешаем промис, когда все данные прочитаны
                //console.log(`Прочитано ${records.length} строк из "${filePath}".`);
                resolve(null);
            });
        })
        
    };
}

export default new FileParser();