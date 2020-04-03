var request = require('request')
var express = require('express')
var bodyparser = require('body-parser')
var app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
var path= require('path')
var server =require('http').createServer(app); 
const io = require('socket.io')(server);
app.post('/weather',function(req,res){
    console.log("Received");
    if(!req.body) return res.sendStatus(400)
    res.setHeader('Content-Type','application/json')
    //var city = req.body.queryResult.parameters.geocity;
    var city = req.body.geocity
    console.log(city)
    var w = getWeather(city)
    var response = " "
    var responseObj = {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                text:w
              }
            }
          ]
        }
      }
  };
    return res.json({
      payload: responseObj,
      //data: speechResponse,
      fulfillmentText: w,
      speech:w,
      displayText: w,
      source: "webhook-echo-sample"
    });
  });
var apiKey = '18063167efa4964644a6e994fafff9c4'
var result 
function cb(err,response,body){
    if(err)
    console.log('error',err)
    var weather = JSON.parse(body)
    console.log(weather)
    if(weather.message === 'city not found'){
        result = 'unable '+weather.message;
    }
    else{
        result = 'Right now its'+weather.main.temp+'degrees wiyth'
    }
}
function getWeather(city){
    result = undefined
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    console.log(url)
    var req = request(url,cb)
    while(result == undefined){
        require('deasync').runLoopOnce();
    }
    return result
}
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html')
})
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })