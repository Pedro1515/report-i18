import React from "react";
import {
  IconButton,
  PopOver,
  MenuItemGroup,
  MenuItem,
  Divider,
  MenuItemProps,
} from "components";
import { DotsVerticalIcon } from "components/icons";
import { useModal } from "utils/hooks";
import { callAll } from "utils";

export interface MenuIconProps {
  items: MenuItemProps[][];
}

export function MenuIcon({ items }: MenuIconProps) {
  const popover = useModal();

  return (
    <div className="relative inline-block">
      <IconButton
        active={popover.visibility}
        onClick={popover.toggle}
        IconComponent={
          <div className="h-5 w-5">
            <DotsVerticalIcon />
          </div>
        }
      />
      <PopOver
        visible={popover.visibility}
        onClose={popover.toggle}
        className="origin-top-right right-0 mt-2"
      >
        {items.map((group, index, arr) => {
          return (
            <React.Fragment key={index}>
              <MenuItemGroup
                key={index}
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {group?.map(({ label, onClick, ...props }) => (
                  <MenuItem
                    key={label}
                    {...{ label }}
                    onClick={callAll(onClick, popover.toggle)}
                    {...props}
                  />
                ))}
              </MenuItemGroup>
              {arr[index] ? <Divider /> : null}
            </React.Fragment>
          );
        })}
      </PopOver>
    </div>
  );
}
