import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { AlertProvider, NotificationProvider, AuthProvider } from "context";
import { fetcher } from "utils/axios";
import "typeface-inter";
import "styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <NotificationProvider>
        <AlertProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </AlertProvider>
      </NotificationProvider>
    </SWRConfig>
  );
}

export default MyApp;
