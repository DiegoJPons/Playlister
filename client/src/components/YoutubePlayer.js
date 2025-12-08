import { useEffect, useRef } from "react";

let currentPlaylist = [];
let currentIndex = 0;
let player = null;
let handleNextSong = () => {};

const loadYouTubeAPIScript = (callback) => {
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }

  if (document.getElementById("youtube-api-script")) {
    window.onYouTubeIframeAPIReady = callback;
    return;
  }

  let tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  window.onYouTubeIframeAPIReady = callback;
};

function togglePlayPause(isPlaying) {
  if (!player) return;
  if (isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

function incSongAndChange() {
  if (currentPlaylist.length === 0) return;

  currentIndex = (currentIndex + 1) % currentPlaylist.length;
  const nextVideoId = currentPlaylist[currentIndex];
  if (player) {
    player.loadVideoById(nextVideoId);
  }

  if (handleNextSong) {
    handleNextSong(nextVideoId);
  }
}

function onPlayerStateChange(event) {
  const playerStatus = event.data;
  if (window.handleStatusChange) {
    window.handleStatusChange(playerStatus);
  }
  if (playerStatus === 0) {
    incSongAndChange();
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
}

export default function YouTubePlayer({
  youtubeId,
  playlist,
  onStatusChange,
  onNextSong,
}) {
  console.log("YouTubePlayer rendered. youtubeId prop:", youtubeId);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    currentPlaylist = playlist || [];

    const propIndex = currentPlaylist.indexOf(youtubeId);
    if (propIndex !== -1) {
      currentIndex = propIndex;
    }
  }, [playlist, youtubeId]);

  useEffect(() => {
    window.handleStatusChange = onStatusChange;
    return () => {
      delete window.handleStatusChange;
    };
  }, [onStatusChange]);

  const isValidYouTubeId = (id) => /^[a-zA-Z0-9_-]{11}$/.test(id);

  useEffect(() => {
    if (!youtubeId || !isValidYouTubeId(youtubeId)) {
      return;
    }

    if (player && player.loadVideoById) {
      const currentVideoId = player.getVideoData
        ? player.getVideoData()?.video_id
        : null;
      if (currentVideoId !== youtubeId) {
        player.loadVideoById(youtubeId);
      }
      return;
    }

    const createPlayer = () => {
      if (!window.YT || !playerContainerRef.current) return;

      if (player) {
        player.destroy();
        player = null;
      }

      player = new window.YT.Player(playerContainerRef.current, {
        videoId: youtubeId,
        height: "390",
        width: "640",
        playerVars: {
          playsinline: 1,
          autoplay: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    loadYouTubeAPIScript(createPlayer);

    return () => {
      if (player) {
        player.destroy();
      }
      player = null;
      currentPlaylist = [];
      currentIndex = 0;
    };
  }, [youtubeId]); // 💡 CHANGE 3: Add youtubeId to dependencies

  useEffect(() => {
    if (player && player.loadVideoById && youtubeId) {
      const currentVideoId = player.getVideoData
        ? player.getVideoData()?.video_id
        : null;
      if (currentVideoId !== youtubeId) {
        player.loadVideoById(youtubeId);
      }
    }
  }, [youtubeId]);

  useEffect(() => {
    window.togglePlayPause = togglePlayPause;
    return () => {
      delete window.togglePlayPause;
    };
  }, []);

  useEffect(() => {
    handleNextSong = onNextSong || (() => {});
    return () => {
      handleNextSong = () => {};
    };
  }, [onNextSong]);

  return youtubeId ? (
    <div
      ref={playerContainerRef}
      id="youtube-player-iframe"
      style={{
        position: "absolute",
        top: 0,
        left: 30,
        width: "90%",
        height: "50%",
      }}
    ></div>
  ) : null;
}
