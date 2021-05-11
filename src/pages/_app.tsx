import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { AlertProvider, NotificationProvider, AuthProvider } from "src/context";
import { fetcher } from "src/utils";
import "typeface-inter";
import "src/styles/tailwind.css";
import "src/styles/styles.css";
import { LocationProvider } from "src/context/location-context";

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
            <LocationProvider>
//             <Component {...pageProps} />
            </LocationProvider>
          </AuthProvider>
        </AlertProvider>
      </NotificationProvider>
    </SWRConfig>
  );
}

export default MyApp;