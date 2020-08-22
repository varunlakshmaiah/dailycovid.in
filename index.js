const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000

const publicDir = __dirname+"/public/"
const sendOpt = {
    root: publicDir
}

app.get('/', (req, res) => {
    res.sendFile("index.html",sendOpt,function(err){
      if(!err)
      {
          console.log("Request completed");
      }
  })
})

app.get('/download', (req, res) => {
    file = publicDir+"insta.jpg"
    res.download(file)  
})

app.get('/api/covid/india',(req,res)=>{
    var config = {
        method: 'get',
        url: 'https://api.covid19india.org/data.json',
        headers: {}
      };
      
      axios(config)
      .then(function (response) {
        let dataResponse = {status:"success",data:response.data}
        res.json(dataResponse)
      })
      .catch(function (error) {       
        let errorResponse = {status:"error","message":error.message}
        res.json(errorResponse)             
      });
})


app.get('/api/covid/stats',(req,res)=>{
    var config = {
        method: 'get',
        url: 'https://thevirustracker.com/free-api?global=stats',
        headers: {}
      };
      
      axios(config)
      .then(function (response) {
        let data = response.data
        data = data["results"][0]
        delete data.source
        let dataResponse = {status:"success",data}
        res.json(dataResponse)
      })
      .catch(function (error) {       
        let errorResponse = {status:"error","message":error.message}
        res.json(errorResponse)             
      });
})

const server = app.listen(PORT, () => {
    console.log(`-------- ${new Date().toUTCString()} : App listening at http://localhost:${PORT} -------`)
})