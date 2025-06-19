const streamAudio = document.getElementById("radioStream");
const controlButton = document.getElementById("toggleRadio");
const nowPlaying = document.querySelector(".now-playing");

const stationId = "zabrij-radio"; // Your station ID
const apiKey = "pk_f59abf349a934227bd94f5af5d945086"; // Your API key

// Play/Pause the stream (button text does NOT change)
controlButton.addEventListener("click", () => {
  if (streamAudio.paused) {
    streamAudio
      .play()
      .catch((error) => console.error("Playback error:", error));
  } else {
    streamAudio.pause();
  }
});

// Function to fetch the currently playing track from Radio Cult
function fetchTrackInfo() {
  fetch(`https://api.radiocult.fm/api/station/${stationId}/schedule/live`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey, // Your API key
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data); // Log the full response to see the structure in console
      const status = data.result.status;
      const trackInfo = data.result.metadata; // Accessing metadata which contains title info

      if (status === "schedule" && trackInfo) {
        // When the station is live, display track title
        nowPlaying.textContent =
          trackInfo.artist + " - " + trackInfo.title || "Unknown Track"; // Fallback if title is missing
      } else if (status === "offAir") {
        // When the station is off air, display off air message
        nowPlaying.textContent = "We are off air right now.";
      } else if (status === "defaultPlaylist") {
        nowPlaying.textContent = "We are playing from the default playlist.";
      } else {
        nowPlaying.textContent = "Error: No content available.";
      }
    })
    .catch((error) => {
      nowPlaying.textContent = "Error loading track info";
      console.error("Error fetching track info:", error);
    });
}

// Fetch track info every 10 seconds
setInterval(fetchTrackInfo, 10000);
fetchTrackInfo();
