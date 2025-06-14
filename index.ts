require("dotenv").config();
import { startHttpServer } from "./src/httpServer/httpServer";
import cronService from "./src/services/cronService/cronService";
import InitializePostgres from "./src/db/postgres/init";

async function starServer() {
   const initDb:boolean= await InitializePostgres.initializeModelDB()
    startHttpServer();
    //fileParser.parseCSVsite()
    cronService.startTasks();
} 

starServer();



