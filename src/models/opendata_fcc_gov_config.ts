
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/postgres/postgres';


export enum DTOpenDataFccGovConfigRow{
    key="key",
    value="value",

}
class DTOpenDataFccGovConfig extends Model{
    declare key:string;
    declare value:string;
}
DTOpenDataFccGovConfig.init(
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
        
        tableName:"dt_opendata_fcc_gov_config",
        sequelize
    }
    )

  export default  DTOpenDataFccGovConfig;