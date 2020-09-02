import type { AppProps } from "next/app";
import "typeface-inter";
import "styles/tailwind.css";
import { AlertProvider } from "context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider>
      <Component {...pageProps} />
    </AlertProvider>
  );
}

export default MyApp;
