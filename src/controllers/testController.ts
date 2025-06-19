import { TControllerHandler } from "../types/TControllerHandler";


class TestController {

  test:TControllerHandler=async(req, res) => {
        try {
          
          return res.status(200).send("OK");
        } catch (error) { 
          console.log(error);
          
          res.status(500).send(error);
        }
      }
      
      
}

export default new TestController()
