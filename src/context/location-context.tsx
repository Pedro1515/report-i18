import { createContext, useState } from "react";
import i18next from "i18next";
import global_us from 'src/utils/lang/us/global.json'
import global_ar from 'src/utils/lang/ar/global.json'
import { I18nextProvider } from "react-i18next";

const LocationContext =  createContext({})

const LocationProvider = ({children}) => {
  const [location, setLocation] = useState('us')
  
  const handleLocation = (local) => {
        localStorage.setItem('location', local);
        switch (local) {
            case "ar":
                setLocation("ar")
                break;

            case "us":
                setLocation("us")
                break;

            default:
                setLocation("us")
                break;
        }
    }

    i18next.init({
        interpolation:{ escapeValue: false },
        lng: location,
        resources:{
          us: {
            global: global_us
          },
          ar: {
            global: global_ar
          }
        }
      })

    return (
      <I18nextProvider i18n={i18next}>
        <LocationContext.Provider value={{location, handleLocation}}>
          {children}
        </LocationContext.Provider>
      </I18nextProvider>
    )
}

export { LocationProvider, LocationContext }
