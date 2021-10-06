const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

let connectionConfig = { host:process.env.HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE,
    port:process.env.DB_PORT}
    console.log(connectionConfig);
const connection = mysql.createConnection(connectionConfig);

connection.connect((err) =>
{
    if(err)
    {
        console.log(err.message);
    }
    //console.log('db'+ connection.state);
});

class DbService
{
    static getDbServiceInstance()
    {
        return instance ? instance : new DbService();
    }

    async getAllData()
    {
        try
        {
            const response = await new Promise((resolve, reject) =>
            {
                const query = "SELECT * FROM names;";
                connection.query(query, (err, results) =>
                {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            console.log(response);
            return response;

        }catch(error){
            console.log(error);
        }
        
    }


    async insertNewName(name)
    {
        try {
            const dateAdded =  new Date();
            const insertID = await new Promise((resolve, reject) =>
            {
                console.log({name});
                const query = "INSERT INTO names(name,date_added) VALUES (?, ?);";
                connection.query(query, [name,dateAdded] , (err, result) =>
                {
                    if(err) {
                        return reject(err);
                    }
                    else {
                        // console.log({result});
                       return resolve(result.insertId);
                    }
                })
            });
            // console.log({insertID});
            let returnData = {
                id : insertID,
                name : name,
                dateAdded : dateAdded
            };
            
            return returnData;
            ; 
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id)
    {
        try
        {
            id = parseInt(id,10);
            const response = await new Promise((resolve, reject) =>
                {
                    const query = "DELETE FROM names WHERE id = ?";
                    connection.query(query, [id] , (err, result) =>
                    {
                        if(err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
                
                return (response === 1 ? true :false);

                // console.log(response);

        }catch(error){
        
            console.log(error);
            return false;
        }
       
    }

    async updateNameById(id,name)
    {
        try
        {
            id = parseInt(id,10);
            const response = await new Promise((resolve, reject) =>
                {
                    const query = "UPDATE names SET name = ? WHERE id = ?";
                    connection.query(query, [name,id] , (err, result) =>
                    {
                        console.log({id,name,result});
                        if(err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });
                console.log({response});
                return response === 1 ? true :false;

                console.log(response);

        }catch(error){
        
            console.log(error);
            return false;
        }
    }


    async searchByName(name)
    {
        try
        {
            const response = await new Promise((resolve, reject) =>
            {
                const query = "SELECT * FROM names WHERE name = ?;";
                connection.query(query,[name], (err, results) =>
                {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            //console.log(response);
            return response;

        }catch(error){
            console.log(error);
        }
        
    }

}

module.exports = DbService;