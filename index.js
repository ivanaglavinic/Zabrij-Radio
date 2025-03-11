function toggleMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.toggle("active");
}

const clientID = "MisMbnefMS4Sbq7qAnuzooa5dAwUsEq0"; // Replace with your SoundCloud Client ID
let currentTrackUrl = null;
let widget = null;

async function fetchTrackData(trackUrl) {
  const apiUrl = `https://api.soundcloud.com/resolve?url=${trackUrl}&client_id=${clientID}`;
  const response = await fetch(apiUrl);
  const trackData = await response.json();

  return trackData;
}

function handleSearch() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  console.log(`Query: ${query}`);

  const artists = document.querySelectorAll(".artist");
  const resultsDiv = document.getElementById("searchResults");

  resultsDiv.innerHTML = "";

  let resultsFound = false;

  artists.forEach((artist) => {
    const artistName = artist.getAttribute("data-name").toLowerCase();
    console.log(`Artist Name: ${artistName}`);
    // Check if the artist's name includes the search query
    if (artistName.includes(query)) {
      artist.style.display = "block";
      resultsFound = true;
    } else {
      artist.style.display = "none"; // Hide non-matching artists
    }
  });

  // If no results were found, display a message
  if (!resultsFound && query !== "") {
    resultsDiv.innerHTML = `<p>No artists found.</p>`;
  }
}

function changeTrack(trackId) {
  const iframe = document.getElementById("player");
  iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23efce65&inverse=true&auto_play=true&show_user=true`;

  const playerContainer = document.getElementById("player-container");

  playerContainer.style.display = "block";
}

window.onload = function () {
  let slides = document.querySelectorAll(".slide");
  let index = 0;

  function showSlides() {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  function moveSlide(step) {
    index += step;
    console.log("Moving slide to index:", index);

    // Loop back to the first slide if we're at the last one
    if (index >= slides.length) {
      index = 0;
    }

    // Loop back to the last slide if we're at the first one
    if (index < 0) {
      index = slides.length - 1;
    }

    showSlides();
  }

  showSlides();

  // Auto slide every 4 seconds
  setInterval(() => {
    moveSlide(1); // Automatically move to the next slide
  }, 4000);
};

function goBack() {
  // Check if the previous page is from your own site
  if (document.referrer.includes(window.location.hostname)) {
    window.history.back(); // Go back normally
  } else {
    window.location.href = "index.html"; // Redirect to a safe fallback page
  }
}
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
      Authorization: `Bearer ${apiKey}`, // Your API key
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data); // Log the full response to see the structure
      const status = data.result.status;
      if (status === "schedule" && data.result.content) {
        // Display song title if available
        nowPlaying.textContent =
          data.result.content.title || "No title available";
      } else if (status === "offAir") {
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
