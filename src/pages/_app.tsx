import { AppProps } from "next/app";
import { Header } from "../componentes/Header";
import "../styles/globals.scss";
import { SessionProvider } from "next-auth/react";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />;
    </SessionProvider>
  );
}

export default MyApp;
