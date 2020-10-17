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
  Spinner,
  useSearchBox,
} from "components";
import classNames from "classnames";
import { useDebounce, useFeatures, useTests, useRun } from "utils/hooks";
import { ProtectRoute } from "context";
import {
  CheckCircleIcon,
  ClockIcon,
  TagSolidIcon,
  BeakerIcon,
  CrossCircleIcon,
} from "components/icons";
import { format } from "date-fns";
import { customFormatDuration, getTotalBy } from "utils";
import { Feature, Run as ApiRun } from "api";
import { useRouter } from "next/router";

interface FeatureItemProps {
  name: string;
  status: string;
  isActive?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function StatusBadge({ status }) {
  return <Badge label={status} color={status === "pass" ? "green" : "red"} />;
}

function FeatureItem({ name, status, isActive, onClick }: FeatureItemProps) {
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
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="font-medium text-sm">{name}</div>
        {isActive ? (
          <div className="text-indigo-600 w-5 h-5 ml-2">
            <CheckCircleIcon />
          </div>
        ) : null}
      </div>
      <StatusBadge status={status} />
    </li>
  );
}

function Search({ onSelect, selectedFeatureId }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");
  const { query } = useRouter();
  const { features } = useFeatures(query.rid as string);
  const debouncedSearch = useDebounce(value, 500);
  const [visible, setVisible] = React.useState(false);

  const handleSelect = (feature) => (event) => {
    event.stopPropagation();
    onSelect(feature);
  };

  return (
    <div className="py-4 w-1/2 relative">
      <SearchBox
        inputProps={getInputProps({
          onChange: (e) => console.log(e.target.value),
          onFocus: () => setVisible(true),
          onBlur: () => setVisible(false),
          placeholder: "Buscar feature...",
        })}
        resetterProps={getResetterProps({})}
        fullWidth
      />
      <PopOver
        visible={visible}
        className="origin-top-left mt-2 w-full overflow-y-auto border"
        style={{ maxHeight: 400 }}
        onClose={() => {}}
      >
        <MenuItemGroup>
          {features?.content.map((feature) => (
            <FeatureItem
              key={feature.id}
              name={feature.name}
              status={feature.status}
              isActive={selectedFeatureId === feature.id}
              onClick={handleSelect(feature)}
            />
          ))}
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

interface SummaryProps {
  run?: ApiRun;
}

const Summary = React.memo(function Summary({ run }: SummaryProps) {
  return (
    <div className="w-1/2">
      <div className="flex mt-2 -mx-6">
        <div className="w-1/3">
          <DataDisplay
            label="Total features"
            value={getTotalBy("feature", run)}
          />
        </div>
        <div className="w-1/3">
          <DataDisplay
            label="Total scenarios"
            value={getTotalBy("scenario", run)}
          />
        </div>
        <div className="w-1/3">
          <DataDisplay label="Total steps" value={getTotalBy("steps", run)} />
        </div>
      </div>
    </div>
  );
});

function Step({ status, name }) {
  return (
    <li className="flex items-center">
      <div
        className={classNames(
          { "text-red-600": status === "fail" },
          { "text-green-600": status === "pass" },
          "w-5",
          "h-5",
          "mr-2"
        )}
      >
        {status === "pass" ? <CheckCircleIcon /> : <CrossCircleIcon />}
      </div>
      {name}
    </li>
  );
}

function TestCard({ name, steps = [] }) {
  return (
    <div className="mt-4 border border-gray-300 rounded-md p-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">{name}</div>
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
      <ul className="text-sm space-y-2 py-4">
        {steps?.map(({ id, status, name }) => (
          <Step key={id} {...{ id, status, name }} />
        ))}
      </ul>
    </div>
  );
}

function ScenarioCard({ name, duration, status, tags, description, tests }) {
  const formattedDuration = customFormatDuration({ start: 0, end: duration });

  return (
    <div className="rounded-md border px-4 mt-6">
      <div className="flex border-b -mx-4 py-3 px-4 items-center justify-between">
        <div className="flex items-center">
          <div className="font-medium text-sm">{name}</div>
          <div className="mx-2 text-gray-500">&middot;</div>
          <div className="flex items-center">
            <div className="w-4 h-4 text-gray-500 mr-2">
              <ClockIcon />
            </div>
            {formattedDuration ? (
              <span className="block text-gray-500 text-sm" title="Duration">
                {formattedDuration}
              </span>
            ) : null}
          </div>
          {tags?.map((tag) => (
            <Badge
              key={tag}
              IconComponent={
                <div className="text-gray-700 w-3 h-3 mr-2">
                  <TagSolidIcon />
                </div>
              }
              className="m-2"
              uppercase={false}
              color="gray"
              label={tag}
            />
          ))}
          <StatusBadge status={status} />
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
        <div className="text-sm font-medium mb-4">Datos iniciales</div>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        {tests.map((test) => {
          const { id, name, nodes: steps } = test;
          return <TestCard key={id} name={name} steps={steps} />;
        })}
      </div>
    </div>
  );
}

function FeatureHeading({ created, name, tags }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-medium">{name}</div>
          <div className="text-sm mt-1">
            Creado el {format(new Date(created), "dd/MM/yyyy HH:ss")}
          </div>
          <div className="-mx-2">
            {tags?.map((tag) => (
              <Badge
                key={tag}
                IconComponent={
                  <div className="text-gray-700 w-3 h-3 mr-2">
                    <TagSolidIcon />
                  </div>
                }
                className="m-2"
                uppercase={false}
                color="gray"
                label={tag}
              />
            ))}
          </div>
        </div>
        <div>
          <Button label="Editar" variant="white" color="indigo" />
        </div>
      </div>
    </div>
  );
}

function FeatureEmptyPlaceholder() {
  return (
    <div className="h-full flex-center flex-col font-medium text-gray-500 bg-gray-100">
      <div className="w-16 h-16 mb-4">
        <BeakerIcon />
      </div>
      <p className="text-center">
        Selecciona una feature del buscador <br />
        para ver el detalle.
      </p>
    </div>
  );
}

function FeatureContent({ feature }) {
  const { name, startTime, categoryNameList, id } = feature ?? {};
  const { tests, isLoading } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const scenarioOutline = f ? f.nodes : [];

  if (!feature) {
    return <FeatureEmptyPlaceholder />;
  }

  return (
    <div className="px-6 py-4 flex-auto">
      <FeatureHeading name={name} created={startTime} tags={categoryNameList} />
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex-center mt-20">
            <Spinner className="h-10 w-10 text-gray-500" />
          </div>
        ) : (
          scenarioOutline?.map((scenario) => {
            const {
              id,
              name,
              status,
              duration,
              categoryNameList,
              description,
              nodes: tests,
            } = scenario;

            return (
              <ScenarioCard
                key={id}
                name={name}
                status={status}
                duration={duration}
                tags={categoryNameList}
                tests={tests}
                description={description}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function SummaryWrapper({ children }) {
  return (
    <div
      className={classNames(
        "px-6",
        "py-4",
        "border-b",
        "w-full",
        "flex",
        "space-x-10"
      )}
    >
      {children}
    </div>
  );
}

function Run() {
  const { query } = useRouter();
  const [feature, setFeature] = React.useState<Feature>(null);
  const { id } = feature ?? {};
  const { run } = useRun(query.rid as string);

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex space-x-4">
          <span className="font-medium text-lg">Run name</span>
        </div>
      </LayoutHeader>
      <LayoutContent scrollable>
        <SummaryWrapper>
          <Search
            onSelect={(feature) => setFeature(feature)}
            selectedFeatureId={id}
          />
          <Summary run={run} />
        </SummaryWrapper>
        <FeatureContent feature={feature} />
      </LayoutContent>
    </Layout>
  );
}

export default ProtectRoute(Run);
