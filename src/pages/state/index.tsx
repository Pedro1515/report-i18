import React from "react";
import { useRouter } from "next/router";
import { Layout, LayoutHeader, LayoutContent, Title, useSearchBox, SearchBox } from "src/components";
import { ProtectRoute } from "src/context";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";


/*===============================================================================*/






import Link from "next/link";
import classNames from "classnames";
import { Avatar } from "src/components/";
import { ArchiveIcon, UsersIcon } from "src/components/icons";

export interface SidebarItemsProps {
  href: string;
  label: string;
  IconComponent?: React.ReactNode;
}

export function SidebarItem({ href, label, IconComponent }: SidebarItemsProps) {
  const router = useRouter();
  const active = router.pathname.includes(href);
  return (
    <Link {...{ href }}>
      <a
        className={classNames(
          "flex",
          "items-center",
          "p-2",
          { "hover:bg-gray-800": !active },
          "rounded",
          { "bg-gray-800": active },
          "text-sm",
          "justify-center",
          "xl:justify-start"
        )}
        title={label}
      >
        <div
          className={classNames(
            "w-5",
            "h-5",
            { "text-gray-700": !active },
            {
              "text-gray-500": active,
            }
          )}
        >
          {IconComponent}
        </div>
        <span
          className={classNames(
            "hidden",
            "xl:block",
            "ml-4",
            { "text-gray-600": !active },
            "font-medium",
            "text-sm",
            {
              "text-gray-400": active,
            }
          )}
        >
          {label}
        </span>
      </a>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside
      className={classNames(
        "z-20",
        "w-16",
        "xl:w-64",
        "overflow-y-auto",
        "bg-gray-900",
        "flex-shrink-0",
        "overflow-x-hidden"
      )}
    >
      <div className="p-2 xl:p-4 flex flex-col justify-center">
        <img
          className="hidden xl:block h-12 w-auto object-contain"
          src="/assets/logo_lippia.png"
          alt="lippia"
        />
        <img
          className="block xl:hidden h-10 w-auto object-contain mt-2"
          src="/assets/logo_lippia_min.png"
          alt="lippia"
        />
        <Avatar />
        <div className="space-y-3">
          <SidebarItem
            href="/projects"
            label="Proyectos"
            IconComponent={<ArchiveIcon />}
          />
          {/* <SidebarItem href="/users" label="Gestionar usuarios" IconComponent={<UsersIcon />} /> */}
        </div>
      </div>
    </aside>
  );
}







/*===============================================================================*/

function SidebarState() {
  return (
    <>
      <Navigation
          activeItemId="/management/members"
          onSelect={({ itemId }) => {
            console.log("primary");
          }}
          items={[
            {
              title: "Primary",
              itemId: "/Primary",
            },
          ]}
        />
        <Navigation
          activeItemId="/management/members"
          onSelect={({ itemId }) => {
            console.log("secundary");
          }}
          items={[
            {
              title: "Secundary",
              itemId: "/secundary",
            },
          ]}
        />
    </>
  );
}

function Search({ onSearch }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");

  const filter = (e) => {
    const searchText = e.target.value;

      onSearch(searchText);
    
  
  };
  
  return (
    <div className="py-4 w-full md:w-2/3 xl:w-1/4">
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

function State() {
  const [filters, setFilters] = React.useState({
    page: 0,
    size: 5,
    name: ""
  });
  const { query } = useRouter();
  // const { project } = useProject(query.id as string);

  // const primary = () => {
  //   console.log('primary');
  // }

  return (
    <Layout>
        <SidebarState />
        <div className="px-6 py-4">
          <Title>filtros</Title>
          <Search onSearch={(search: string) => setFilters({page:0, size: 5, name: search})} />
        </div>
    </Layout>
  );
}

export default ProtectRoute(State);
