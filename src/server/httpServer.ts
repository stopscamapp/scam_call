
import express from 'express';
import testRouter from '../routes/testRouter';
import { Routes } from '../routes/routes';


const app = express();
const port = 8090; 

// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

export const startHttpServer=()=>{
    //app.use(cors(corsOptions))
    app.use(express.json());
    app.use("/test",testRouter);
    app.use("/api/v1/numberRouter",Routes.v1.numberRouter)
    app.listen(port, async() => {
        
        //openAIService.sendMessage("how does the shield work in the app");
        console.log(`Сервер запущен на http://localhost:${port}`);
    });
}