import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
// import { UserProvider } from "@auth0/nextjs-auth0";

const App = ({ Component, pageProps }) => {
  const redirectUri = () => {
    const redirectUri =
      (typeof window !== "undefined" && window.location.href) ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      "http://localhost:3000";
    console.log({ redirectUri });
    return redirectUri;
  };

  return (
    <Auth0Provider
      domain="hunch-dev.us.auth0.com"
      clientId="XBR4DuNwF6JhB9TDMzxXzdXiG0coVuJt"
      redirectUri={redirectUri()}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
};

export default App;
