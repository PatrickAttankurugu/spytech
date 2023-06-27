const startStreamButton = document.getElementById("start-stream");
const stopStreamButton = document.getElementById("stop-stream");
const videoElement = document.getElementById("video");

const socket = new WebSocket("ws://127.0.0.1:8000/ws");

// Function to initialize the websocket connection
socket.addEventListener("open", (event) => {
  socket.send("Hello from the client!");
});

socket.addEventListener("message", (event) => {
  console.log("Message from server: ", event.data);
});

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("WebSocket message received:", data);
};

socket.onclose = (event) => {
  console.log("WebSocket closed:", event);
  setTimeout(initWebSocket, 5000); // Attempt to reconnect after 5 seconds
};

socket.onerror = (error) => {
  console.log("WebSocket error:", error);
};


// Function to start the video stream
async function startVideo() {
  try {
    // Send a request to the FastAPI backend to start the video stream
    await fetch('/start');

    // Set the video source and start playing
    videoElement.src = 'http://127.0.0.1:8000/video';
    videoElement.play();
  } catch (error) {
    console.error('Error starting video stream:', error);
  }
}

// Function to stop the video stream
// Function to stop the video stream
async function stopStream() {
  try {
    const response = await fetch("http://127.0.0.1:8000/pause", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to pause the video stream.");
    }

    videoElement.src = "";

    // Send a WebSocket message to stop tracking
    socket.send(JSON.stringify({ action: "stop_tracking" }));
  } catch (error) {
    console.error("Error stopping the video stream:", error);
    alert("An error occurred while stopping the video stream. Please check the console for more details.");
  }
}


// Event listeners for the buttons
startStreamButton.addEventListener("click", startVideo);
stopStreamButton.addEventListener("click", stopVideo);

// Initialize the WebSocket connection
initWebSocket();
