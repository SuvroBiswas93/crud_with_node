const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require ('dotenv');
const { response, request } = require('express');
dotenv.config({ path: '.env' });

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));



//Create
app.post('/insert',( request, response ) =>
{
    const{Name:name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);

    result
    .then(data => {return response.json({data:data})})
    .catch(err =>{ console.log(err);return response.end()});


    // console.log(request.body);
});

//Read
app.get('/getAll', ( request, response ) =>
{
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();

    result
    .then(data => {return response.json({data : data})})
    .catch(err => console.log(err));
});

//Update
app.patch('/update',(request,response) =>
{
    const{ id, name } = request.body;
    console.log(id);
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id,name);

   result
   .then(data => response.json({success:data}))
   .catch(err => console.log(err));
});


//Delete
app.delete('/delete/:id',(request,response) =>
{
    // console.log('===react==');
   const {id} = request.params;
   const db = dbService.getDbServiceInstance();

   const result = db.deleteRowById(id);

   result
   .then(data =>{return response.json({success:data})})
   .catch(err => console.log(err));
});

//Search
app.get('/search/:name',(request,response) =>
{
    const {name} = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);

    result
    .then(data => {return response.json({data : data})})
    .catch(err => console.log(err));
})

app.get('/',(req,res)=>res.end('hello world'));

app.listen(process.env.PORT, ()=> console.log(`app is running on port: ${process.env.PORT}`));