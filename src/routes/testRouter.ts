const express = require('express');
const testRouter = express.Router();
import TestController from "../controllers/testController"
testRouter.get("/",TestController.test);


export default testRouter;