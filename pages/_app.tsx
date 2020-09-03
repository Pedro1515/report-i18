import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { AlertProvider } from "context";
import { fetcher } from "utils/axios";
import "typeface-inter";
import "styles/tailwind.css";
// import "rc-pagination/assets/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </SWRConfig>
  );
}

export default MyApp;
