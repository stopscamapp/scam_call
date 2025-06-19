import express from 'express';
const numberRouter = express.Router();
import NumberController from "../../controllers/v1/numberController"
numberRouter.post("/",NumberController.phoneHook);
numberRouter.post("/check",NumberController.check);
numberRouter.post("/report",NumberController.report);
numberRouter.get("/load_db_file",NumberController.loadDbFile);


export default numberRouter;