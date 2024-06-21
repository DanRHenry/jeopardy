const messages = document.getElementById("messages");
const wsOpen = document.getElementById("ws-open");
const wsClose = document.getElementById("ws-close");
const wsSend = document.getElementById("ws-send");
const wsInput = document.getElementById("ws-input");

const serverPort = 3400;
const PORT = serverPort;

const showMessage = (message) => {
  if (!messages) {
    return;
  }
  messages.textContent += `\n${message}`;
  messages.scrollTop = messages.scrollHeight;
};

function closeConnection() {
  if (!!ws) {
    ws.close();
  }
}
wsOpen.addEventListener("click", () => {
  // closeConnection();
  // console.log("open clicked")
  ws = new WebSocket(`ws://localhost:${PORT}`);

  ws.addEventListener("error", () => {
    showMessage("Websocket error");
  });

  ws.addEventListener("open", () => {
    showMessage("Websocket connection established");
  });

  ws.addEventListener("close", () => {
    showMessage("Websocket connection closed");
  });

  //! This is what will handle what to do with incoming messages (keys/values that will control the game's changes)
  ws.addEventListener("message", (message) => {
    showMessage(`received message: ${message.data}`);
  });
});

wsClose.addEventListener("click", closeConnection);

wsSend.addEventListener("click", () => {
  const val = { input: wsInput?.value };
  if (!val.input) {
    return;
  }
  if (!ws) {
    showMessage("No Websocket Connection");
    return;
  } else if (!ws) {
    showMessage("No Websocket Connection");
    return;
  }

  ws.send(val.input);
  showMessage(val.input);
});
