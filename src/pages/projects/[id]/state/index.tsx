import React, { useState } from 'react';
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  SearchBox,
  PopOver,
  Badge,
  MenuItemGroup,
  Button,
  MenuIcon,
  Spinner,
  useSearchBox,
  MediaModal,
} from "src/components";
import classNames from "classnames";
import {
  useDebounce,
  useFeatures,
  useTests,
  useRun,
  useProject,
} from "src/utils/hooks";
import { ProtectRoute } from "src/context";
import {
  CheckCircleIcon,
  ClockIcon,
  TagSolidIcon,
  BeakerIcon,
  CrossCircleIcon,
  ExclamationSolidIcon,
} from "src/components";
import { format } from "date-fns";
import { customFormatDuration, getTotalBy } from "src/utils";
import { Feature, Run as ApiRun, updateTest} from "src/api";
import { getMedias } from "src/api";
import { useRouter } from "next/router";

interface FeatureItemProps {
  name: string;
  status: string;
  isActive?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

// @ts-ignore
const FeatureContext = React.createContext();

function FeatureProvider(props) {
  const [feature, setFeature] = React.useState<Feature>(null);
  const value = { feature, setFeature };
  return <FeatureContext.Provider value={value} {...props} />;
}

function useFeature() {
  const context = React.useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeature must be used within a FeatureProvider");
  }
  return context;
}

/*===============================================================================*/
function Search({ onSearch }) {
    const { value, getInputProps, getResetterProps } = useSearchBox("");
    return (
      <div className="py-1 w-full md:w-3/3 x2:w-4/4">
        <SearchBox
          fullWidth
          inputProps={getInputProps({
            // onChange: filter,
            placeholder: "Buscar",
          })}
          resetterProps={getResetterProps({ onClick: () => {} })}
        />
      </div>
    );
  }

/*===============================================================================*/
const SidebarState = () => {
    const { query } = useRouter();
    const { project } = useProject(query.id as string);
  
    const {
      errorState,
      lastRun: { categoryNameList = [] } = {},
    } = project ?? {};
  
    return (
      <>
        <>
          <div className="navbar">
            <div className="states-Num">
              <h1>States</h1>
              <span>{errorState && errorState.length}</span>
            </div>
            <div className="features-search">
              {/* <Search onSearch={(search: string) => setFilters({page:0, size: 5, name: search})} /> */}
              <Search onSearch={""} />
            </div>
          </div>
          <nav className={"nav-menu"}>
            <ul className="nav-menu-items">
              
            {errorState?.map((error) => (<li key={error} >{error}</li>))}
              {/* {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <a to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })} */}
            </ul>
          </nav>
        </>
      </>
    );
  };

function State() {
    return (
      <Layout>
        <SidebarState />
      </Layout>
    );
  }

function RunWithProvider() {
  return (
    <FeatureProvider>
      <State />
    </FeatureProvider>
  );
}

export default ProtectRoute(RunWithProvider);
