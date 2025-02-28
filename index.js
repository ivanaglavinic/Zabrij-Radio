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

function goBack() {
  // Check if the previous page is from your own site
  if (document.referrer.includes(window.location.hostname)) {
    window.history.back(); // Go back normally
  } else {
    window.location.href = "home.html"; // Redirect to a safe fallback page
  }
}
const streamAudio = document.getElementById("radioStream");
const controlButton = document.getElementById("toggleRadio");
const nowPlaying = document.querySelector(".now-playing"); // Select the correct div

// Toggle Play/Pause
controlButton.addEventListener("click", () => {
  if (streamAudio.paused) {
    streamAudio.play();
    controlButton.textContent = "⏸ Pause";
  } else {
    streamAudio.pause();
    controlButton.textContent = "▶ Play";
  }
});

// Function to fetch currently playing track
function fetchTrackInfo() {
  fetch("https://zabrijradio.airtime.pro/api/live-info-v2")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.now_playing) {
        nowPlaying.textContent = data.now_playing.name; // Update only song text
      } else {
        nowPlaying.textContent = "No live track info available";
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
