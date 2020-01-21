const express = require('express');
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

const app = express();

const port = 5000;

// Import other required libraries
const fs = require('fs');
const util = require('util');
async function main() {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();

    // The text to synthesize
    const text = 'Hello, world!';

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML Voice Gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}

app.get('/api/customers', (req, res) => {
    const customers = [
        { id: 1, firstName: 'Frank', lastName: 'Su' },
        { id: 2, firstName: 'Anna', lastName: 'LM' },
        { id: 3, firstName: 'Anna', lastName: 'Jo' },
        { id: 4, firstName: 'Peter', lastName: 'Weng' },
    ];

    res.json(customers);
});

app.get('/', function(req, res) {
    res.sendFile(path.resolve('output.mp3'));
});

main();

app.listen(port, () => console.log('Server started on port ' + port));