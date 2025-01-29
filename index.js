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

function playAudio(trackUrl) {
  const playButton = document.getElementById("playButton");
  const iframe = document.getElementById("soundcloud-player");
  const customPlayer = document.querySelector(".custom-player");
  const playerContainer = document.getElementById("player-container");
  const customPlayButton = document.getElementById("custom-play-button");
  const customPauseButton = document.getElementById("custom-pause-button");

  customPlayer.style.display = "block";
  playerContainer.style.display = "block";
  iframe.style.display = "none";

  if (trackUrl !== currentTrackUrl) {
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      trackUrl
    )}&auto_play=true`;

    iframe.src = embedUrl;
    iframe.onload = () => {
      widget = SC.Widget(iframe);
      widget.play();
    };

    currentTrackUrl = trackUrl;
  } else {
    widget.play();
  }

  customPlayButton.style.display = "none";
  customPauseButton.style.display = "block";
}

function pauseAudio() {
  const customPlayButton = document.getElementById("custom-play-button");
  const customPauseButton = document.getElementById("custom-pause-button");
  const playButton = document.getElementById("playButton");

  if (widget) {
    widget.pause(); // Pause the music
  }

  // Show the play button, hide the pause button
  customPlayButton.style.display = "block";
  customPauseButton.style.display = "none"; // Hide custom pause button
  playButton.style.display = "block"; // Show play button on artist image
}

document.addEventListener("DOMContentLoaded", () => {
  const playButtons = document.querySelectorAll(".track-button");

  playButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const trackUrl = button.getAttribute("data-url");

      const customPlayButton = document.getElementById("custom-play-button");
      customPlayButton.setAttribute("data-url", trackUrl);

      playAudio(trackUrl);
    });
  });
  // const pauseButton = document.getElementById("pauseButton");
  // pauseButton.addEventListener("click", pauseAudio);

  const customPlayButton = document.getElementById("custom-play-button");
  customPlayButton.addEventListener("click", () => {
    const trackUrl = customPlayButton.getAttribute("data-url");
    playAudio(trackUrl);
  });
});

function setupProgressBar() {
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");

  if (!widget) return;

  // Update the progress bar as the track plays
  widget.bind(SC.Widget.Events.PLAY_PROGRESS, function (event) {
    const progressPercent = (event.currentPosition / event.duration) * 100;
    progressBar.style.width = `${progressPercent}%`; // Update the progress bar width
  });

  // Allow users to click on the progress bar to seek
  progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect(); // Get the container's dimensions
    const offsetX = e.clientX - rect.left; // Click position relative to the container
    const newPercent = (offsetX / rect.width) * 100; // Calculate the percentage

    widget.getDuration((duration) => {
      const newTime = (duration / 100) * newPercent;

      widget.seekTo(newTime); // Seek to the new position
    });
  });
}

// Add this to your existing DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("soundcloud-player");

  iframe.onload = () => {
    widget = SC.Widget(iframe); // Initialize the SoundCloud widget
    setupProgressBar(); // Initialize the progress bar
  };
});

function handleSearch() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  console.log(`Query: ${query}`);

  const artists = document.querySelectorAll(".artist");
  const resultsDiv = document.getElementById("searchResults");

  resultsDiv.innerHTML = "";

  // Track if any results match the query
  let resultsFound = false;

  // Loop through all artist elements
  artists.forEach((artist) => {
    // Get the artist's name from the data-name attribute
    const artistName = artist.getAttribute("data-name").toLowerCase();
    console.log(`Artist Name: ${artistName}`);
    // Check if the artist's name includes the search query
    if (artistName.includes(query)) {
      artist.style.display = "block"; // Show matching artists
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
