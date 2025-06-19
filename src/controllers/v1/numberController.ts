import { Op } from "sequelize";
import ScumNumbers, { ScumNumbersRow } from "../../models/scamNumbers";
import { TControllerHandler } from "../../types/TControllerHandler";
import fs from 'node:fs';
import path from 'node:path';
import etag from 'etag';
import zlib from 'node:zlib';
import bulksService from "../../services/bulks/bulksService";
class NumberController {
    
  phoneHook:TControllerHandler=async(req, res) => {
        try {
          const {deviceId,number}=req.body as {deviceId:string|undefined,number:string|undefined};
          console.log(req.body);
          if(!number){
                return res.status(400).send();
          }
          console.log("deviceId");
          console.log(deviceId);
          console.log("number");
          console.log(number);
          return res.status(200).send("OK");
        } catch (error) { 
          console.log(error);
          
          res.status(500).send(error);
        }
      }
      report:TControllerHandler=async(req, res) => {
        try {
          const {number,text}=req.body as {number:string|undefined,text:string|undefined};
          console.log(req.body);
          if(!number){
                return res.status(400).send();
          }
          console.log("number");
          console.log(number);
          console.log("text");
          console.log(text);
          return res.status(200).send("OK");
        } catch (error) { 
          console.log(error);
          
          res.status(500).send(error);
        }
      }
      check:TControllerHandler=async(req, res) => {
        try {
          console.log("check");
          return res.status(200).send({block:true,description:"auto"});
          const {number}=req.body as {number:string};
          if(!number){
            return res.status(400).send();
          }
          const result = await bulksService.checkNumber(number);
          if(result.includes("Robocall")||result.includes("Spam")||result.includes("Fraudulent")){
            
            res.status(200).send({block:true,});

            await ScumNumbers.bulkCreate(
                    [
                        {
                          [ScumNumbersRow.number]:number,
                          [ScumNumbersRow.description]:result,
                          [ScumNumbersRow.date]: new Date(),
                        }
                    ],
                    {
                        ignoreDuplicates:true,
                        validate:true
                    }
                )
            return;

          }else{
            return res.status(200).send({block:false,description:result});
          }
        } catch (error) { 
          console.log(error);
          
          res.status(500).send(error);
        }
      }

      loadDbFile:TControllerHandler=async(req, res) => {
        try {
          const FILE = path.resolve(
            __dirname,                       // …/src/services/cronService/tasks
            '../../var',                  // поднялись до …/src/var
            'numbers.ndjson'                 // сам файл
          );
         const stat = await fs.promises.stat(FILE); 
         const tag  = etag(stat); 
         if (req.headers['if-none-match'] === tag) {
            return res.status(304).end();
          }
          res.set({
            'Content-Type':   'application/x-ndjson; charset=utf-8',
            'Content-Length': stat.size,
            'Last-Modified':  stat.mtime.toUTCString(),
            'ETag'          : tag,
            'Content-Encoding' : 'gzip',
            'Cache-Control':  'public, max-age=0'   // всегда проверяем актуальность
          });
          
          const stream = fs.createReadStream(FILE).pipe(zlib.createGzip());
          console.log("start stream");
          
          stream.pipe(res);
        } catch (error) { 
          console.log(error);
          
          res.status(500).send(error);
        }
      }
      
      
}

export default new NumberController()
