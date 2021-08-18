require("dotenv").config();
const express = require("express");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const lyricsFinder = require("lyrics-finder");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  const { code } = req.body;

  spotifyApi
    .authorizationCodeGrant(code)
    .then(({ body }) => {
      res.json({
        accessToken: body.access_token,
        refreshToken: body.refresh_token,
        expiresIn: body.expires_in,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.sendStatus(400);
    });
});

app.post("/refreshAuth", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) res.sendStatus(404);

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then(({ body }) => {
      res.json({
        accessToken: body.access_token,
        expiresIn: body.expires_in,
      });
    })
    .catch((err) => {
      console.log("refresh err ", err);
      res.sendStatus(401);
    });
});

app.get("/searchTracks", (req, res) => {
  const searchStr = req.query.search;
  const accessToken = req.headers["access-token"] ?? null;

  if (!accessToken) res.statusCode(401);

  const spotifyApi = new SpotifyWebApi({
    accessToken,
  });

  spotifyApi
    .searchTracks(searchStr)
    .then(({ body }) => {
      res.json({
        tracks: body.tracks ?? [],
      });
    })
    .catch((err) => {
      console.log("searchTracks err", err);
      res.sendStatus(404);
    });
});

app.get("/lyrics", async (req, res) => {
  const { title, artist } = req.query;

  try {
    let lyrics = (await lyricsFinder(artist, title)) || null;
    res.json({ lyrics });
  } catch (err) {
    res.sendStatus(500);
  }
});

app.listen(3031);
