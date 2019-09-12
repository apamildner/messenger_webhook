'use strict';
require("dotenv").config();
// Imports dependencies and set up http server
const express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  FBMessenger = require('fb-messenger');

  
const request = require('request')
const {query_nlp_api} = require('./client.js');
const messenger = new FBMessenger({token: process.env.FB_ACCESS_TOKEN});
// Sets server port and logs message on success
app.listen(process.env.PORT || 5000, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 

// Creates the endpoint for our webhook 
app.post('/webhook', async (req, res) => {  
 
  let body = req.body;
  console.log(body.entry[0].messaging)
  if(body.entry[0].messaging[0].message != undefined ){ //This is only defined if it's a user that sent the message from facebook messenger.

  const text = body.entry[0].messaging[0].message.text
  console.log(text)
  console.log(process.env.FB_ACCESS_TOKEN)
  /*
  try {
    const response = await messenger.sendTextMessage({id:process.env.USER_ID, text:"Tjo brammi"});
    console.log(response)
  } catch (e) {
    console.error(e)
  }
  */
 const sendOnTyping = function(recipientID){
    
  request.post(
      "https://graph.facebook.com/v2.6/me/messages?access_token="+process.env.FB_ACCESS_TOKEN,
      { json: {
          "recipient":{
              //"id":process.env.USER_ID
              "id":recipientID
          },
          "sender_action":"typing_on"
      }},
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log("Sucessfully posted to url");
          }
      });
};
const sendSeen = function(recipientID){
  request.post(
      "https://graph.facebook.com/v2.6/me/messages?access_token="+process.env.FB_ACCESS_TOKEN,
      { json: {
          "recipient":{
              //"id":process.env.USER_ID
              "id":recipientID
          },
          "sender_action":"mark_seen"
      }},
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log("Sucessfully posted to url");
          }
      });
};
  const try_send = async function (send_fun){
    try{
      const response = await send_fun;
      console.log(response);
    }catch(e){
      console.error(e);
    }

  }
  sendSeen(process.env.USER_ID);

  query_nlp_api(text).then( nlp_api_response => {
    sendOnTyping(process.env.USER_ID);
    setTimeout(() => {
      try_send(messenger.sendTextMessage({id:process.env.USER_ID, text: nlp_api_response.fulfillmentText || "sho"}))
    }, 1000);

  }, error =>{
    console.error(error);
  });
}


  if (body.object === 'page') {

    // Returns a '200 OK' response to all requests
    res.status(200).send();
  
     } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

app.get('/webhook', (req, res) => {  
 
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
  console.log(VERIFY_TOKEN)
  //let VERIFY_TOKEN="mandelmassa123"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});