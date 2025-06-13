require("dotenv").config();
import { startHttpServer } from "./src/httpServer/httpServer";
import cronService from "./src/services/cronService/cronService";
import fileParser from "./src/services/fileParser/fileParser";

async function starServer() {

   //const initDb:boolean= await InitializePostgres.initializeModelDB()
    startHttpServer();
    //fileParser.parseCSVsite()
    cronService.startTasks();
} 

starServer();



