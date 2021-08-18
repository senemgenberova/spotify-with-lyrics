import React, { useEffect, useState } from "react";
import axios from "axios";

const useAuth = (code) => {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
  });

  useEffect(() => {
    if (!code) return;

    axios
      .post("http://localhost:3031/login", { code })
      .then(({ data }) => {
        setAuth(data);

        window.history.pushState({ accessToken: data.accessToken }, null, "/");
      })
      .catch((err) => {
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    const { refreshToken, expiresIn } = auth;
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      axios
        .post("http://localhost:3031/refreshAuth", {
          refreshToken: refreshToken,
        })
        .then(({ data }) => {
          setAuth((prevState) => ({
            ...prevState,
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
          }));
        })
        .catch((err) => {
          window.location = "/";
        });
    }, expiresIn * 1000);

    return () => clearInterval(interval);
  }, [auth.refreshToken, auth.expiresIn]);

  return auth;
};

export default useAuth;
