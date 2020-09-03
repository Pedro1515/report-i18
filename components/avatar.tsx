import classNames from "classnames";
import { PopOver } from "components";
import { SelectorIcon } from "components/icons";
import { useModal } from "utils/hooks";
import { MenuItemGroup, MenuItem, Divider } from "./menu-item";

export function Avatar({ name, role }) {
  const { visibility, toggle } = useModal();
  return (
    <div className="my-8">
      <div
        className={classNames(
          "flex",
          "items-center",
          "justify-around",
          "py-2",
          "rounded-md",
          "hover:shadow-sm",
          "hover:border-gray-300",
          "border-transparent",
          "border",
          "cursor-pointer",
          "hover:bg-white",
          "duration-100",
          { "bg-white border-gray-300": visibility }
        )}
        onClick={toggle}
      >
        <div className="flex items-center">
          <img src="/assets/avatar.png" className="rounded-full h-10" />
          <div className="flex flex-col text-sm truncate ml-4">
            <span className="font-medium leading-7">{name}</span>
            <span className="text-gray-500 text-xs uppercase">{role}</span>
          </div>
        </div>
        <div className="w-5 h-5 text-gray-500">
          <SelectorIcon />
        </div>
      </div>
      <PopOver
        visible={visibility}
        className="origin-top-left mt-2"
        onClose={toggle}
      >
        <MenuItemGroup>
          <MenuItem label="Configuracion de cuenta" />
          <MenuItem label="Habilitar modo oscuro" />
          <MenuItem label="Soporte" />
        </MenuItemGroup>
        <Divider />
        <MenuItemGroup>
          <MenuItem label="Cerrar sesion" />
        </MenuItemGroup>
      </PopOver>
    </div>
  );
}
