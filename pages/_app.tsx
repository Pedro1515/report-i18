import type { AppProps } from "next/app";
import "typeface-inter";
import "styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
