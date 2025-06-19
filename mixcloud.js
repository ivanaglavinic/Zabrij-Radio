// Replace with your actual Mixcloud username
const MIXCLOUD_USERNAME = "zabrijradio";

// No client credentials needed for public tracks!

let widget = null;
let currentTrackData = null;

// Function to extract Mixcloud track slug from URL
function extractTrackSlug(mixcloudUrl) {
  const match = mixcloudUrl.match(/mixcloud\.com\/([^\/]+\/[^\/]+)/);
  return match ? match[1] : null;
}

// Function to format date like the original site
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Function to extract genres from tags (simplified)
function extractGenres(tags) {
  if (!tags || tags.length === 0) return "";

  // Take first few tags as genres
  const genreList = tags.slice(0, 3).map((tag) => tag.name.toLowerCase());
  return genreList.join("\n");
}

// Function to generate track HTML matching the original style
function generateTrackHTML(track, index) {
  const trackSlug = extractTrackSlug(track.url);
  const uploadDate = formatDate(track.created_time);
  const artistName = track.user.name;
  const trackTitle = track.name;
  const genres = extractGenres(track.tags);

  return `
    <div class="track-item">
      <div class="track-image-container" onclick="playTrack('${trackSlug}', '${trackTitle.replace(
    /'/g,
    "\\'"
  )}', '${artistName.replace(/'/g, "\\'")}')">
        <img
          class="track-image"
          src="${
            track.pictures.large ||
            track.pictures.medium ||
            track.pictures.small ||
            "https://via.placeholder.com/280x280/000/fff?text=No+Image"
          }"
          alt="${trackTitle}"
          onerror="this.src='https://via.placeholder.com/280x280/000/fff?text=No+Image'"
        />
        <div class="play-button">
          <div class="play-icon"></div>
        </div>
      </div>
      <div class="track-info">
        <div>
         ${trackTitle}
        </div>
        <p class="track-date">${uploadDate}</p>
        ${genres ? `<div class="track-genres">${genres}</div>` : ""}
      </div>
    </div>
  `;
}

// Function to play track using Mixcloud Widget API
function playTrack(trackSlug, trackName, artistName) {
  if (!trackSlug) {
    console.error("Invalid track slug");
    return;
  }

  // Show player container
  const playerContainer = document.getElementById("playerContainer");
  const currentTrackInfo = document.getElementById("currentTrackInfo");
  const mixcloudWidget = document.getElementById("mixcloudWidget");

  // Update current track info
  currentTrackInfo.textContent = `${artistName} // ${trackName}`;

  // Set up the widget URL
  const widgetUrl = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=1&feed=%2F${trackSlug}%2F`;

  // Load the widget
  mixcloudWidget.src = widgetUrl;
  mixcloudWidget.style.display = "block";

  // Show the player
  playerContainer.style.display = "block";

  // Initialize the widget API (optional - for more control)
  widget = Mixcloud.PlayerWidget(mixcloudWidget);

  widget.ready.then(function () {
    console.log("Widget is ready");
  });

  // Store current track data
  currentTrackData = { trackSlug, trackName, artistName };
}

// Function to close player
function closePlayer() {
  const playerContainer = document.getElementById("playerContainer");
  const mixcloudWidget = document.getElementById("mixcloudWidget");

  playerContainer.style.display = "none";
  mixcloudWidget.src = "";
  mixcloudWidget.style.display = "none";

  if (widget) {
    // Stop playback if widget API is available
    widget.pause();
  }
}

// Function to load tracks from Mixcloud
async function loadMixcloudTracks() {
  try {
    // Public API - no authentication needed
    const apiUrl = `https://api.mixcloud.com/${MIXCLOUD_USERNAME}/cloudcasts/`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const tracks = data.data;

    if (!tracks || tracks.length === 0) {
      document.getElementById("tracksContainer").innerHTML =
        '<div class="loading">No tracks found</div>';
      return;
    }

    // Generate HTML for each track
    const tracksHTML = `
      <div class="tracks-grid">
        ${tracks
          .map((track, index) => generateTrackHTML(track, index))
          .join("")}
      </div>
    `;

    // Update the container
    document.getElementById("tracksContainer").innerHTML = tracksHTML;

    console.log(`Loaded ${tracks.length} tracks`);
  } catch (error) {
    console.error("Error loading Mixcloud tracks:", error);
    document.getElementById(
      "tracksContainer"
    ).innerHTML = `<div class="loading">Error loading tracks: ${error.message}</div>`;
  }
}

// Load tracks when page loads
document.addEventListener("DOMContentLoaded", loadMixcloudTracks);

// Handle keyboard shortcuts (optional)
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && currentTrackData) {
    event.preventDefault();
    if (widget) {
      console.log("Space pressed - toggle playback");
    }
  }
  if (event.code === "Escape") {
    closePlayer();
  }
});
