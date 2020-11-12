// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
// const {Card, Suggestion} = require('dialogflow-fulfillment');
const express = require("express");
const app = express();
const request = require("request");
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 

app.get("/",(request,response)=>{
    response.send("Hello World");
})


// {"responseId":"0b0026ba-1e31-4742-86c1-edba63175f99-aabf4fdf",
// "queryResult":{"queryText":"hi","parameters":{},"allRequiredParamsPresent":true,"fulfillmentText":"Hi. I am PIAIC assistant. How I help you?","fulfillmentMessages":[{"text":{"text":["Hi. I am PIAIC assistant. How I help you?"]}}],"outputContexts":[{"name":"projects/dsc-piaic-vhur/agent/sessions/2d1949b7-3f2d-a716-396f-a0f056639cfe/contexts/__system_counters__","parameters":{"no-input":0,"no-match":0}}],"intent":{"name":"projects/dsc-piaic-vhur/agent/intents/747dc4c3-b19c-4dde-8015-c6e9fafe56a2","displayName":"Greetings"},"intentDetectionConfidence":1,"languageCode":"en"},"originalDetectIntentRequest":{"source":"DIALOGFLOW_CONSOLE","payload":{}},"session":"projects/dsc-piaic-vhur/agent/sessions/2d1949b7-3f2d-a716-396f-a0f056639cfe"}

app.post("/dialogflow", express.json(),(request,response)=>{
    // const agent = new WebhookClient({ request, response });
    const agent = new WebhookClient({ request: request, response: response });
    // console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body.queryResult.queryText));
    function welcome(agent) {
        let city = agent.parameters["geo-city"];
        return temperature(city)
        .then(temp=>{
            let temp = JSON.stringify(temp);
            return agent.add(`${temp}`)
        })
        .catch(()=>{
            return agent.add("An error occured")
        })
    }
   
    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }
  
    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Greetings', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
  
})

app.listen(3000,()=>{
    console.log("I am running")
})


function temperature(city){
    let promise = new Promise((resolve, reject) => {
    request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid={APPID}`, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  resolve(body);
});
})
return promise
}      
