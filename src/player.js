document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const playlistSelect = document.getElementById('playlistSelect');
  const bitrateButtons = document.getElementById('bitrateButtons');
  const videoInfo = document.getElementById('videoInfo');
  const urlInput = document.getElementById('urlInput');
  const loadButton = document.getElementById('loadButton');
  const urlLogs = document.getElementById('urlLogs');
  const clearLogs = document.getElementById('clearLogs');

  let hls = null;

  if (Hls.isSupported()) {
    hls = new Hls();

    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      createBitrateButtons(data.levels);
      displayVideoInfo(data.levels[0]);
    });

    hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
      const level = hls.levels[data.level];
      displayVideoInfo(level);
    });

    hls.on(Hls.Events.FRAG_LOADING, function (event, data) {
      logUrl(data.frag.url);
    });

    function loadSource(url) {
      hls.loadSource(url);
      hls.attachMedia(video);
      video.play();
    }

    playlistSelect.addEventListener('change', (e) => {
      loadSource(e.target.value);
    });

    loadButton.addEventListener('click', () => {
      loadSource(urlInput.value);
    });

    function createBitrateButtons(levels) {
      bitrateButtons.innerHTML = '';
      levels.forEach((level, index) => {
        const button = document.createElement('button');
        button.innerText = `${level.height}p`; 
        button.addEventListener('click', () => {
          hls.currentLevel = index;
        });
        bitrateButtons.appendChild(button);
      });
    }

    function displayVideoInfo(level) {
      videoInfo.innerHTML = `
        <span class="info-label">Bitrate:</span> ${level.bitrate} <br>
        <span class="info-label">Height:</span> ${level.height} <br>
        <span class="info-label">Width:</span> ${level.width} <br>
        <span class="info-label">Video codec:</span> ${level.videoCodec} <br>
        <span class="info-label">Audio codec:</span> ${level.audioCodec}
      `;
    }

    function logUrl(url) {
      const li = document.createElement('li');
      li.textContent = url;
      urlLogs.appendChild(li);
    }

    clearLogs.addEventListener('click', () => {
      urlLogs.innerHTML = '';
    });

    loadSource(playlistSelect.value);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = playlistSelect.value;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
});
