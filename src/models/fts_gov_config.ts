
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/postgres/postgres';

//ключи для DTFtcGovConfig
export const LAST_DATE_KEY="LAST_DATE_KEY";


export enum DTFtcGovConfigRow{
    key="key",
    value="value",

}
class DTFtcGovConfig extends Model{
    declare key:string;
    declare value:string;
}
DTFtcGovConfig.init(
    {   
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        
        tableName:"dt_ftc_gov_config",
        sequelize
    }
    )

  export default  DTFtcGovConfig;