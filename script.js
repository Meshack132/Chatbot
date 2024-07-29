document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('talkButton');
    const socket = io.connect('http://localhost:3000');

    button.addEventListener('click', () => {
        startRecognition();
    });

    function startRecognition() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                console.log('Voice recognition started. Try speaking into the microphone.');
            };

            recognition.onerror = (event) => {
                console.error(event.error);
            };

            recognition.onend = () => {
                console.log('Voice recognition ended.');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('You said: ', transcript);
                socket.emit('voiceData', transcript);
            };

            recognition.start();
        } else {
            console.log('Speech recognition not supported in this browser.');
        }
    }
});
