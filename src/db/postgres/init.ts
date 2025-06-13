import postgresDb from "./postgres";
import DTFtcGovConfig from "../../models/fts_gov_config";
import DTOpenDataFccGovConfig from "../../models/opendata_fcc_gov_config";


class InitializePostgres{
    
    async initializeModelDB():Promise<boolean>{
        try {
          await postgresDb.authenticate();
          await this.initializeModels();
          return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
        
    }

    private async initializeModels(){
        try {
            await DTFtcGovConfig.sync({ alter: true });
            await DTOpenDataFccGovConfig.sync({ alter: true });
        } catch (error) {
            console.log(error);
            
        }
        
    }


}

export default new InitializePostgres();