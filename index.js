//am using express for handling my request (CRUD)
const express = require('express');
const app = express();

//get mysql plugins
const mysql = require('mysql');

//create my connection here
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "saskfunddb"
});

//Helps me get information from my server.
app.get('/', (req, res)=> {

    res.send('<h1>SaskFund App</h1><h2>Welcom to SaskFund Client Application Page.</h2>');
});

app.get('/api/client', (req, res) => {
    let dQuery = "SELECT * FROM client_full_information  ORDER BY CLIENT_ID";
    con.connect(err =>{
        if (err) throw err;
        con.query(dQuery, (err, result, fields) => {
        if (err) throw err;
        clients = result;
        res.send(JSON.stringify(clients));
        });
    });//ends my connet.


});

app.get('/api/client/:id', (req, res) => {
    dReq = req.params.id;
    dQuery = '';
    if(isNaN(dReq)){
        dQuery = `SELECT Name, Client_ID, Gender, Age, City, Gold_Membership FROM client_full_information WHERE NAME LIKE '${dReq}%' ORDER BY CLIENT_ID`;
    }
    else{
        dQuery = `SELECT Name, Client_ID, Gender, Age, City, Gold_Membership FROM client_full_information WHERE Client_ID=${dReq}`;
     }
     
    con.connect(err =>{
        
        con.query(dQuery, (err, result, fields) => {
        if (err) throw err;
        clients = result;
        
        //if not found send a status 404 
        if(!clients)
            res.status(404).send('<div style="color:red">The client id does not exist in database</div>');
        res.send(JSON.stringify(clients));
        //res.send(dQuery);
        
        });
    });//ends my connet.
});

app.get('/api/eligibility/:id', (req, res) => {
    dReq = req.params.id;
    dQuery = '';
 
    //Please check if it's client id, else show an error message.
    if(isNaN(dReq)){
        
       res.send(`${dReq} is not an ID, Please type Client ID`);
    }
    else{
        dQuery = `SELECT * FROM ( SELECT Name, Client_ID, Monthly_Repayment, IF((cfi.Length_at_Residence <6) AND 
        (cfi.Monthly_Repayment < 40_45Percent_Income) AND 
        (cfi.House_Value = 0) AND 
        (cfi.Age > 24) OR ((cfi.Age > 21 AND cfi.Education > 3)), 'Yes','No' ) Eligible_Status 
        FROM client_full_information cfi) q WHERE  Client_ID=${dReq}`;
     
            con.connect(err =>{
                
            con.query(dQuery, (err, result, fields) => {
            if (err) throw err;
            clients = result;
            
            //if not found send a status 404 
            if(!clients)
                res.status(404).send('<div style="color:red">The client id does not exist in database</div>');
            res.send(JSON.stringify(clients));
            //res.send(dQuery);
            
            });
        });//ends my connet.
    }
    
});

//using environment variable - helping for deployment purposes.
const myPort = process.env.PORT || 3000;
app.listen(myPort, () => console.log(`Listening on port ${myPort}...`));

