function toggleMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.toggle("active");
}
function playAudio() {
  const iframe = document.getElementById("soundcloud-player");
  iframe.style.display = "block"; // Show the iframe

  const trackUrl = document
    .querySelector(".track-button")
    .getAttribute("data-url");
  const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    trackUrl
  )}&auto_play=true`;

  if (iframe.src !== embedUrl) {
    iframe.src = embedUrl;
    iframe.onload = () => {
      const widget = SC.Widget(iframe);
      widget.play();
    };
  } else {
    const widget = SC.Widget(iframe);
    widget.play(); // Resume playback if already loaded
  }

  document.getElementById("playButton").style.display = "none"; // Hide play button
  document.getElementById("pauseButton").style.display = "inline-block"; // Show pause button
}

function pauseAudio() {
  const iframe = document.getElementById("soundcloud-player");
  const widget = SC.Widget(iframe);

  widget.pause(); // Pause the music

  document.getElementById("playButton").style.display = "inline-block"; // Show play button
  document.getElementById("pauseButton").style.display = "none"; // Hide pause button
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".track-button");
  const playerContainer = document.getElementById("player-container");

  let widget; // Declare the SoundCloud widget globally

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const trackUrl = button.getAttribute("data-url");
      const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        trackUrl
      )}&auto_play=true`;

      const iframe = document.getElementById("soundcloud-player");
      iframe.src = embedUrl;

      // Show the player container and pause button
      playerContainer.style.display = "block";
      document.getElementById("pauseButton").style.display = "inline-block";

      // Initialize the SoundCloud widget
      iframe.onload = () => {
        widget = SC.Widget(iframe); // SoundCloud Widget
      };
    });
  });

  // Pause button functionality
  document.getElementById("pauseButton").addEventListener("click", () => {
    if (widget) {
      widget.pause(); // Pause the music
    }
    document.getElementById("playButton").style.display = "inline-block"; // Show play button
    document.getElementById("pauseButton").style.display = "none"; // Hide pause button
  });
});

// <a id="playSound" onclick="playAudio()"> <img src="images/icons8-play-48 (1).png" /></a>

function handleSearch() {
  // Get the search query from the input field and convert it to lowercase
  const query = document.getElementById("searchBar").value.toLowerCase();
  console.log(`Query: ${query}`);
  // Select all artist elements and the results div
  const artists = document.querySelectorAll(".artist");
  const resultsDiv = document.getElementById("searchResults");

  // Clear any previous "No artists found" message
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
