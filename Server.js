const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const apiai = require('apiai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const APIAI_TOKEN = 'meshack-hx9g';
const apiAiClient = apiai(APIAI_TOKEN);

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('chat message', (text) => {
        console.log('Received voice data: ', text);

        let apiaiReq = apiAiClient.textRequest(text, {
            sessionId: 'APIAI_SESSION_ID'
        });

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;
            socket.emit('bot reply', aiText);
        });

        apiaiReq.on('error', (error) => {
            console.error(error);
        });

        apiaiReq.end();
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
