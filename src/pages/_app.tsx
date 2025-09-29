import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "@/themes";

import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
import { GoogleAnalytics } from "nextjs-google-analytics";


const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <GoogleAnalytics trackPageViews gaMeasurementId="G-Q8X1DN1GW9" />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;