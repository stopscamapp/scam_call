import { Sequelize } from 'sequelize';


const postgresDb:Sequelize = new Sequelize(
    `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASS}@localhost:5432/${process.env.DB_BASE}`,{logging:false}
);
//const sequelize:Sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/gnom',{logging:false});
    
export default postgresDb;