import { Readable } from 'node:stream';
import * as fast from 'fast-csv';
import { ICSVFields } from '../../interfaces/ICSVFields';
import { IParserModelDto } from '../../dto/parserModelDto';

class CSVParser{

    fromStream(stream:Readable,fields:ICSVFields){
        return new Promise<IParserModelDto[]>((resolve,reject)=>{
                    
                    let records:IParserModelDto[] = [];
                    //const regex = /^\d{3}-\d{3}-\d{4}$/;
        
                    let rowCount = 0;
                    stream
                    .pipe(fast.parse({ headers: true })) // `headers: true` автоматически использует первую строку как заголовки
                    .on('error', error => {
                        // Отклоняем промис при ошибке
                        reject(new Error(`Ошибка парсинга CSV файла ${error}`));
                    })
                    .on('data', async row => {
                         // Увеличиваем счетчик при каждой новой строке данных
                         //console.log(row);
                         
                        rowCount++;
                        //console.log(rowCount);

                        const number =  row[fields.number];
                        //console.log(number);
                        let  numberStr;
                        if(fields.numberRegExp!=null){
                            if(fields.numberRegExp.test(number)){
                                
                                //const  numberStr ="1"+(number.split("-").join(""));
                            }else{
                                return;
                            } 
                            
                        }
                        if(fields.numberconverter!=null){
                            numberStr = fields.numberconverter(number);
                        }else{
                            numberStr = number;
                        }
                        //console.log(numberStr);
                        let date:Date;

                        const dateField = row[fields.date]
                        //console.log(dateField);
                        if(fields.dateConverter!=null){
                           const dateConverted = fields.dateConverter(dateField);
                           if(dateConverted==null){
                            return;
                           }else{
                            date=dateConverted;
                           }
                        }else{
                            const dateInMilliseconds  = Date.parse(row[fields.date]);
                            date = new Date(dateInMilliseconds); 
                        }
                         console.log(date);
                         
                        if(date.getFullYear()==2025||date.getFullYear()==2024){
                            
                        }else{
                            return;
                        }
                        const description=row[fields.description]??"not";
                        const csum:IParserModelDto = {
                                    number : numberStr,
                                    description:description,
                                    date:date
                                }
                        records.push(csum)
                        
                    })
                    .on('end', async() => {
                        // Разрешаем промис, когда все данные прочитаны
                        console.log(`Прочитано ${records.length} строк`);
                        resolve(records);
                    });
                })
    }

}

export default new CSVParser()
