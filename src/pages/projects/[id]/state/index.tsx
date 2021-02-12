import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "next/router";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Title,
  useSearchBox,
  SearchBox,
} from "src/components";
import { ProtectRoute } from "src/context";
import { useProject } from "src/utils";

function Search({ onSearch }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");

  const filter = (e) => {
    const searchText = e.target.value;

    onSearch(searchText);
  };

  return (
    <div className="py-1 w-full md:w-2/3 xl:w-1/4">
      <SearchBox
        fullWidth
        inputProps={getInputProps({
          onChange: filter,
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
          <div>
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

/*===============================================================================*/

function State() {
  const [filters, setFilters] = React.useState({
    page: 0,
    size: 5,
    name: "",
  });
  const { query } = useRouter();
  // const { project } = useProject(query.id as string);

  // const primary = () => {
  //   console.log('primary');
  // }

  return (
    <Layout>
      <SidebarState />
    </Layout>
  );
}

export default ProtectRoute(State);
