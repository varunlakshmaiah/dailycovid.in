const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const API = require("./api")

const publicDir = __dirname+"/public/"
const sendOpt = {
    root: publicDir
}

app.use(express.static('public'))

app.use(function (req, res, next) {
    let clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    res.on('finish', function(){       
        console.log(`Responded to ${clientIP}`);
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


 app.listen(PORT, () => {
    console.log(`-------- ${new Date().toUTCString()} : App listening at http://localhost:${PORT} -------`)
})
