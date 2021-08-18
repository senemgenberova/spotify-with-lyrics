import { Button } from "@material-ui/core";

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=7a1a227eef234bbc889eb3fc00febdf4&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

const Login = () => {
  const operations = {
    handleClick: () => {
      window.location = AUTH_URL;
    },
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={operations.handleClick}
    >
      Login with Spotify
    </Button>
  );
};

export default Login;
