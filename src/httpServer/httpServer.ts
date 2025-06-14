
import express from 'express';


const app = express();
const port = 8090; 

// var corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

export const startHttpServer=()=>{
    //app.use(cors(corsOptions))
    app.use(express.json());
    //app.use("/api/v1",scumRouter);
    app.listen(port, async() => {
        
        //openAIService.sendMessage("how does the shield work in the app");
        console.log(`Сервер запущен на http://localhost:${port}`);
    });
}