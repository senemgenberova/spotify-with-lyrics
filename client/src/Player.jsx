import React, { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = ({ token, trackUri }) => {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  return !token ? null : (
    <SpotifyPlayer
      token={token}
      play={play}
      uris={trackUri && [trackUri]}
      callback={(state) => {
        if (state.isActive && !state.isPlaying) setPlay(false);
      }}
      showSaveIcon
    />
  );
};

export default Player;
