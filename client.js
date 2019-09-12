async function query_nlp_api(text) {
//const projectId = 'englishagent-movooj';
const projectId = 'englishagent-movooj';
//const sessionId = '1233461151'; 
const sessionId = 'fa2d5904-a751-40e0-a878-d622fa8d65d9'
const query = 'hi';
const languageCode = 'en-US';
const credentials_file_path = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');

const sessionClient = new dialogflow.SessionsClient({
  projectId,
  keyFilename: credentials_file_path,
});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: text,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  //callback(result.fulfillmentText);
  return Promise.resolve(result);
}
module.exports= {query_nlp_api}