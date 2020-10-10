import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";
import { Avatar } from "components";
import { ArchiveIcon, UsersIcon } from "components/icons";

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
          "text-sm"
        )}
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
        "hidden",
        "w-64",
        "overflow-y-auto",
        "bg-gray-900",
        "md:block",
        "flex-shrink-0"
      )}
    >
      <div className="p-4">
        <img
          className="h-12 w-auto"
          src="/assets/logo_lippia.png"
          alt="lippia"
        />
        <Avatar />
        <div className="space-y-3">
          <SidebarItem
            href="/projects"
            label="Proyectos"
            IconComponent={<ArchiveIcon />}
          />
          <SidebarItem
            href="/users"
            label="Gestionar usuarios"
            IconComponent={<UsersIcon />}
          />
        </div>
      </div>
    </aside>
  );
}
