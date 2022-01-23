import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
// import { UserProvider } from "@auth0/nextjs-auth0";

const App = ({ Component, pageProps }) => {
  return (
    <Auth0Provider
      domain="hunch-dev.us.auth0.com"
      clientId="XBR4DuNwF6JhB9TDMzxXzdXiG0coVuJt"
      redirectUri="http://localhost:3000"
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
};

export default App;
