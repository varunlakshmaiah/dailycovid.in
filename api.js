const express = require("express")
const router = express.Router();
const axios = require('axios')
const quotes = require('./quotes.json')


router.get('/covid/india',(req,res)=>{
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


router.get('/covid/stats',(req,res)=>{
    var config = {
        method: 'get',
        url: 'https://thevirustracker.com/free-api?global=stats',
        headers: {}
      };
      
      axios(config)
      .then(function (response) {
        console.log(response)
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


router.get('/quotes/random',(req,res)=>{  
  let data =  quotes[Math.floor(Math.random() * quotes.length)]; 
  res.json({status:"success",data})
})

module.exports = router;