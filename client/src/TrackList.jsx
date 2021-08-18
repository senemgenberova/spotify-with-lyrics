import React from "react";

const TrackList = ({ tracks, changeTrack = null }) => {
  const handleClick = (track) => {
    changeTrack && changeTrack(track);
  };

  return (
    <div className="track-list">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="track"
          style={{
            background: index % 2 == 0 ? "lightgray" : "#fff",
          }}
          onClick={() => handleClick(track)}
        >
          <img src={track.coverImage} alt={track.title} />
          <div className="info">
            <div>{track.title}</div>
            <div style={{ color: "gray" }}>{track.artist}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
