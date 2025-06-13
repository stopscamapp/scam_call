
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/postgres/postgres';


export enum ScumNumbersRow{
    number="number",
    description="description",

}
class ScumNumbers extends Model{
    declare number:string;
    declare value:string;
}
ScumNumbers.init(
    {   
        number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        
        tableName:"scum_numbers",
        sequelize
    }
    )

  export default  ScumNumbers;