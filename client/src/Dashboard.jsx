import { Box, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Player from "./Player";
import TrackList from "./TrackList";
import useAuth from "./useAuth";

const Dashboard = ({ code }) => {
  const auth = useAuth(code);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [lyrics, setLyrics] = useState(null);

  useEffect(() => {
    if (!search) return;

    let timeout = setTimeout(() => {
      axios
        .get("http://localhost:3031/searchTracks", {
          params: {
            search,
          },
          headers: {
            "access-token": auth.accessToken,
          },
        })
        .then(({ data }) => {
          console.log("track", data?.tracks);
          const tracks = data?.tracks?.items.map((track) => {
            const images = track.album.images;
            const coverImage = images.reduce((prevValue, currentVal) => {
              return currentVal.height < prevValue.height
                ? currentVal
                : prevValue;
            }, images[0]);

            return {
              id: track.id,
              title: track.name,
              uri: track.uri,
              artist: track.artists[0].name,
              coverImage: coverImage.url,
            };
          });

          setResults(tracks);
        })
        .catch((err) => {
          console.log("search err", err);
        });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!selectedTrack) return null;

    axios
      .get("http://localhost:3031/lyrics", {
        params: {
          title: selectedTrack.title,
          artist: selectedTrack.artist,
        },
      })
      .then(({ data }) => {
        setLyrics(data.lyrics);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedTrack]);

  return (
    <Box display="flex" justifyContent="space-around">
      <Box flexGrow={3}>
        <TextField
          label="Search songs/artist"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />

        <TrackList tracks={results} changeTrack={setSelectedTrack} />
        {selectedTrack && (
          <Player token={auth.accessToken} trackUri={selectedTrack.uri} />
        )}
      </Box>
      {lyrics && (
        <Box className="lyrics" flexGrow={1}>
          {lyrics}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
