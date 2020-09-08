import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { AlertProvider, NotificationProvider } from "context";
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
      <NotificationProvider>
        <AlertProvider>
          <Component {...pageProps} />
        </AlertProvider>
      </NotificationProvider>
    </SWRConfig>
  );
}

export default MyApp;
