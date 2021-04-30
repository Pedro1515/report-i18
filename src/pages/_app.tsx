import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { AlertProvider, NotificationProvider, AuthProvider } from "src/context";
import { fetcher } from "src/utils";
import "typeface-inter";
import "src/styles/tailwind.css";
import "src/styles/styles.css";
import i18next from 'i18next'
import global_en from 'src/utils/lang/en/global.json'
import global_es from 'src/utils/lang/es/global.json'
import { I18nextProvider } from 'react-i18next'

i18next.init({
  interpolation:{ escapeValue: false },
  lng: "en",
  resources:{
    en: {
      global: global_en
    },
    es: {
      global: global_es
    }
  }
})

console.log(i18next);


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
            <I18nextProvider i18n={i18next}>
            <Component {...pageProps} />
            </I18nextProvider>
          </AuthProvider>
        </AlertProvider>
      </NotificationProvider>
    </SWRConfig>
  );
}

export default MyApp;
