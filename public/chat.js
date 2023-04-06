//adjust the websocket protocol to whats being used for http
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

//display that we have opened the websocket
socket.onopen =(event) => {
    appendMsg('system', 'websocket', 'connected');
};

//display msgs we receive from our frens
socket.onmessage = async (event) => {
    const text = await event.data.text();
    const chat = JSON.parse(text);
    appendMsg('friend', chat.name, chat.msg);
};

//if the websocket is closed then disable the interface
socket.onclose = (event) => {
    appendMsg('system', 'websocket', 'disconnected');
    document.querySelector('#name-controls').disabled = true;
    document.querySelector('#chat-controls').disabled = true;
};

//send a msg over the websocket
function sendMessage() {
    const msgEl = document.querySelector('#new-msg');
    const msg = msgEl.value;
    if(!!msg) {
        appendMsg('me', 'me', msg);
        const name = document.querySelector('#my-name').value;
        socket.send(`{"name":"${name}", "msg":"${msg}"}`);
        msgEl.value = "";
    }
}

//create 1 long list of msgs
function appendMsg(cls, from, msg) {
    const chatText = document.querySelector('#chat-text');
    chatText.innerHTML = `<div><span class="${cls}">${from}</span>: ${msg}</div>` + chatText.innerHTML;
}

//send msg on enter
const input = document.querySelector('#new-msg');
input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        sendMessage();
    }
});

//disable chat if no name provided
const chatControls = document.querySelector('#chat-controls');
const myName = document.querySelector('#my-name');
myName.addEventListener('keyup', (e) => {
    chatControls.disabled = myName.value === "";
});