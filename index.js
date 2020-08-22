const express = require('express')
const app = express()
const PORT = 3000
const moment = require('moment')
const API = require("./api")

const publicDir = __dirname+"/public/"
const sendOpt = {
    root: publicDir
}


app.use(function (req, res, next) {
    let clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    let reqTime = moment();
    console.log(`${clientIP}--> Request received`)
    
    res.on('finish', function(){
        let resTime = moment();
        let respDuration = moment.duration(resTime.diff(reqTime)).asSeconds();
        console.log(`Responded to ${clientIP} in ${respDuration}s`);
    });
    next()
  })

app.use('/api',API);
  
app.get('/', (req, res) => {
    res.sendFile("index.html",sendOpt,function(err){
      if(!err)
      {
      }
  })
})

app.get('/download', (req, res) => {
    file = publicDir+"insta.jpg"
    res.download(file)  
})


const server = app.listen(PORT, () => {
    console.log(`-------- ${new Date().toUTCString()} : App listening at http://localhost:${PORT} -------`)
})