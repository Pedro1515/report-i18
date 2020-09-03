import classNames from "classnames";
import { Avatar } from "components";
import { HomeIcon, UsersIcon } from "components/icons";

export interface SidebarItemsProps {
  active?: boolean;
  label: string;
  IconComponent?: React.ReactNode;
}

export function SidebarItem({
  active,
  label,
  IconComponent,
}: SidebarItemsProps) {
  return (
    <a
      href="#"
      className={classNames(
        "flex",
        "items-center",
        "p-2",
        { "hover:bg-gray-200": !active },
        "rounded",
        { "bg-gray-300": active },
        "text-sm"
      )}
    >
      <div
        className={classNames("w-5", "h-5", "text-gray-500", {
          "text-gray-600": active,
        })}
      >
        {IconComponent}
      </div>
      <span
        className={classNames(
          "ml-4",
          "text-gray-700",
          "font-medium",
          "text-sm",
          {
            "text-gray-900": active,
          }
        )}
      >
        {label}
      </span>
    </a>
  );
}

export function Sidebar() {
  return (
    <aside
      className={classNames(
        "z-20",
        "hidden",
        "w-64",
        "overflow-y-auto",
        "bg-gray-100",
        "dark:bg-gray-800",
        "md:block",
        "flex-shrink-0",
        "border-r",
        "border-gray-300"
      )}
    >
      <div className="p-4">
        <img
          className="h-16 w-auto"
          src="/assets/logo_lippia_final_color.png"
          alt="lippia"
        />
        <Avatar name="Juan Spoleti" role="ADMIN" />
        <div className="space-y-3">
          <SidebarItem active label="Home" IconComponent={<HomeIcon />} />
          <SidebarItem
            label="Gestionar usuarios"
            IconComponent={<UsersIcon />}
          />
        </div>
      </div>
    </aside>
  );
}
