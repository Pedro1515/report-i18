import React from "react";
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
} from "components";
import classNames from "classnames";
import { useInputValue, useDebounce } from "utils/hooks";
import { ProtectRoute } from "context";
import { CheckCircleIcon, ClockIcon, TagSolidIcon } from "components/icons";
import { format } from "date-fns";
import { customFormatDuration } from "utils";

interface FeatureItemProps {
  name: string;
  status: "pass" | "fail";
  isActive?: boolean;
}

function FeatureItem({ name, status, isActive }: FeatureItemProps) {
  return (
    <li
      className={classNames(
        "flex",
        "justify-between",
        "py-3",
        "px-4",
        "items-center",
        "cursor-pointer",
        "hover:bg-gray-100",
        { "border-l-2 border-indigo-600": isActive }
      )}
    >
      <div className="flex items-center">
        <div className="font-medium text-sm">{name}</div>
        {isActive ? (
          <div className="text-indigo-600 w-5 h-5 ml-2">
            <CheckCircleIcon />
          </div>
        ) : null}
      </div>
      <Badge label={status} color={status === "pass" ? "green" : "red"} />
    </li>
  );
}

function Search({ onSearch }) {
  const search = useInputValue("");
  const debouncedSearch = useDebounce(search.value, 500);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="py-4 w-1/2 relative">
      <SearchBox
        placeholder="Buscar feature..."
        value={search.value}
        fullWidth
        onChange={search.onChange}
        onClear={search.clear}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      />
      <PopOver
        visible={visible}
        className="origin-top-left mt-2 w-full overflow-y-auto border"
        style={{ maxHeight: 400 }}
        onClose={() => {}}
      >
        <MenuItemGroup>
          <FeatureItem name="Minimal bis" status="fail" />
          <FeatureItem name="Minimal bis" status="fail" isActive />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="fail" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="fail" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
          <FeatureItem name="Minimal bis" status="pass" />
        </MenuItemGroup>
      </PopOver>
    </div>
  );
}

function DataDisplay({ label, value }) {
  return (
    <div className="flex flex-col py-3 px-6 xs:w-full">
      <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
        {label}
      </div>
      <div className="mt-2 font-medium text-2xl leading-none">{value}</div>
    </div>
  );
}

function Summary() {
  return (
    <div className="w-1/2">
      <div className="flex mt-2 -mx-6">
        <div className="w-1/3">
          <DataDisplay label="Total features" value={60} />
        </div>
        <div className="w-1/3">
          <DataDisplay label="Total scenarios" value={20} />
        </div>
        <div className="w-1/3">
          <DataDisplay label="Total steps" value={30} />
        </div>
      </div>
    </div>
  );
}

function ScenarioCard() {
  return (
    <div className="rounded-md border px-4 mt-6">
      <div className="flex border-b -mx-4 py-3 px-4 items-center justify-between">
        <div className="flex items-center">
          <div className="font-medium text-sm">
            Scenario Outline: Many additions bis2
          </div>
          <div className="mx-2 text-gray-500">&middot;</div>
          <div className="flex items-center">
            <div className="w-4 h-4 text-gray-500 mr-2">
              <ClockIcon />
            </div>
            <span className="block text-gray-500 text-sm" title="Duration">
              {customFormatDuration({ start: 0, end: 500000 })}
            </span>
          </div>
          <Badge
            IconComponent={
              <div className="text-gray-700 w-3 h-3 mr-2">
                <TagSolidIcon />
              </div>
            }
            className="mx-4"
            uppercase={false}
            color="gray"
            label="@featTag"
          />
        </div>
        <MenuIcon
          items={[
            [
              {
                label: "Eliminar",
                onClick: () => {},
              },
            ],
          ]}
        />
      </div>
      <div className="py-6">
        <div className="text-sm">Datos iniciales</div>
        {/* usar tabla */}
        <div>
          <div className="text-sm">Many additions bis</div>
          <ul className="text-sm space-y-2 mt-2">
            <li className="flex items-center">
              <div className="text-green-600 w-4 h-4 mr-2">
                <CheckCircleIcon />
              </div>{" "}
              Given a calculator I just turned on
            </li>
            <li className="flex items-center">
              <div className="text-green-600 w-4 h-4 mr-2">
                <CheckCircleIcon />
              </div>{" "}
              Given a calculator I just turned on
            </li>
            <li className="flex items-center">
              <div className="text-green-600 w-4 h-4 mr-2">
                <CheckCircleIcon />
              </div>{" "}
              Given a calculator I just turned on
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Run() {
  const [feature, setFeature] = React.useState();
  return (
    <Layout>
      <LayoutHeader>
        <div className="flex space-x-4">
          <span className="font-medium text-lg">Run name</span>
        </div>
      </LayoutHeader>
      <LayoutContent scrollable>
        <div className="px-6 py-4 border-b w-full flex space-x-10">
          <Search onSearch={(search) => console.log(search)} />
          <Summary />
        </div>
        <div className="px-6 py-4 flex-auto">
          {/* <div className="h-full flex-center font-medium text-gray-500 bg-gray-100">
            Selecciona una feature del buscador para ver el detalle.
          </div> */}
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-medium">Minimal Bis</div>
                <div className="text-sm mt-1">
                  Creado el {format(new Date(), "dd/MM/yyyy HH:ss")}
                </div>
                <div className="-mx-2">
                  <Badge
                    IconComponent={
                      <div className="text-gray-700 w-3 h-3 mr-2">
                        <TagSolidIcon />
                      </div>
                    }
                    className="m-2"
                    uppercase={false}
                    color="gray"
                    label="@featTag"
                  />
                </div>
              </div>
              <div>
                <Button label="Editar" variant="white" color="indigo" />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <ScenarioCard />
            <ScenarioCard />
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}

export default ProtectRoute(Run);
