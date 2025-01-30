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

/*async function playAudio(trackUrl) {
  //const playButton = document.getElementById("playButton");

  const playerContainer = document.getElementById("player-container");

  playerContainer.style.display = "block";

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
}*/

/*async function fetchWaveform(trackUrl) {
  const trackData = await fetchTrackData(trackUrl);
  const waveformUrl = trackData.waveform_url.replace("json", "png"); // Get waveform JSON URL
  const waveformJsonUrl = waveformUrl.replace(".png", ".json");

  const response = await fetch(waveformJsonUrl);
  const waveformData = await response.json();

  console.log(trackData);

  return waveformData.samples;
}
/*async function generateWaveform(trackUrl) {
  const waveformContainer = document.getElementById("progress-bar");
  waveformContainer.innerHTML = ""; // Clear existing bars

  const waveformPeaks = await fetchWaveform(trackUrl);
  const totalBars = 50;

  const chunkSize = Math.floor(waveformPeaks.length / totalBars);

  for (let i = 0; i < totalBars; i++) {
    const chunkStart = i * chunkSize;
    const chunkEnd = chunkStart + chunkSize;
    const chunkData = waveformPeaks.slice(chunkStart, chunkEnd);

    const maxPeak = Math.max(...chunkData);

    const bar = document.createElement("div");
    bar.classList.add("wave-bar");
    bar.style.height = `${(maxPeak / 255) * 100}%`; // Normalize height

    waveformContainer.appendChild(bar);
  }
}*/

/*function pauseAudio() {
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
    const waveBars = document.querySelectorAll(".wave-bar");
    const playedBars = Math.floor((progressPercent / 100) * waveBars.length);

    progressBar.style.width = `${progressPercent}%`;

    waveBars.forEach((bar, index) => {
      bar.classList.toggle("played", index < playedBars);
    });
  });

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
*/
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
document.getElementById("prev").addEventListener("click", () => moveSlide(-1));
document.getElementById("next").addEventListener("click", () => moveSlide(1));

console.log(prev);
// Show the first slide initially
showSlides();

// Auto slide every 4 seconds
setInterval(() => {
  moveSlide(1); // Automatically move to the next slide
}, 4000);
