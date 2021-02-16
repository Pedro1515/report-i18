import React, { useEffect, useState } from "react";
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
import { Feature, Run as ApiRun, Test, updateTest } from "src/api";
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

// @ts-ignore
const TestContext = React.createContext();

function TestProvider(props) {
  const [test, setTest] = React.useState<Test>(null);
  const value = { test, setTest };
  return <TestContext.Provider value={value} {...props} />;
}

function useTest() {
  const contextTest = React.useContext(TestContext);
  if (!contextTest) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return contextTest;
}

// agregando features al context
function SetFeatues({ features }) {
  // @ts-ignore
  const { setFeature } = useFeature();
  useEffect(() => {
    setFeature(features);
  }, [features]);
  
  return <>{/* <h1>{feature.name}</h1> */}</>;
}

function StateItem({ name, isActive, onClick }) {
  return (
    <li
    className={classNames(
      "flex",
        "justify-between",
        "py-3",
        "px-4",
        "items-center",
        "hover:bg-gray-200",
        "cursor-pointer",
        { "border-l-2 border-indigo-600 bg-gray-200": isActive }
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="font-medium text-sm">{name}</div>
      </div>
    </li>
  );
}

function NavMenu({ errorState }) {
  // @ts-ignore
  const { setTest } = useTest();
  
  // @ts-ignore
  const { test } = useTest();
  const handleSelect = (error) => (event) => {
    event.stopPropagation();

    // agregando tests o datos de los tests al context
    setTest(error);
  };
  return (
    <nav className="nav-menu">
      <div className="states-Num">
        <h1>States</h1>
        <span>{errorState.length}</span>
      </div>
      <ul className="nav-menu-items">
        {errorState.map((error) => {
          return (
            <StateItem
              key={error}
              name={error}
              isActive={error === test}
              onClick={handleSelect(error)}
            />
          );
        })}
      </ul>
    </nav>
  );
}

function TestEmptyPlaceholder() {
  return (
    <div className="h-full flex-center flex-col font-medium text-gray-500 bg-gray-100">
      <div className="w-16 h-16 mb-4">
        <BeakerIcon />
      </div>
      <p className="text-center">Sin test por mostrar</p>
    </div>
  );
}

function TestCard({ id, name, errorStates, duration, endTime }) {
  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  return (
    <div className="testCard">
      <h2>{name}</h2>
      <p>id: {id}</p>
      {/* <div className='text-red-700 w-3 h-3 mr-2'>{errorStates}</div> */}
      <div className="inline-block">
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
      </div>
      {errorStates.map((error) => (
        <Badge
          key={error}
          IconComponent={
            <div className="text-red-700 w-3 h-3 mr-2">
              <ExclamationSolidIcon />
            </div>
          }
          className="m-2"
          uppercase={false}
          color="red"
          label={error}
        />
      ))}
    </div>
  );
}

function ScenarioOutlineContent({scenario}) {
  const { nodes, bddType } = scenario
  return (
    <div className="h-full">
      {nodes?.map((tests) => {
        const {
          id,
          name,
          errorStates,
          duration,
          endTime,
          nodes: steps,
        } = tests;
        // @ts-ignore
        const { test: errorTest } = useTest();
        if (errorStates && errorStates.includes(errorTest)) {
          return (
            <TestCard
              key={id}
              {...{ id, name, errorStates, duration, endTime }}
            />
          );
        } else {
          return <TestEmptyPlaceholder />;
        }
      })}
    </div>
  );
}

function ScenarioCard({ features }) {
  const { id } = features ?? {};
  const { tests } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const child = f ? f.nodes : [];
  return child?.map((scenario) => {
    return (<ScenarioOutlineContent key={scenario.id} scenario={scenario} />);
  });
}

function FeatureContent({ feature }) {
  return (
    <div className="h-full">
      {feature?.map((features) => {
        return <ScenarioCard key={features.id} features={features} />;
      })}
    </div>
  );
}

function FeatureData({ content }) {
  return <SetFeatues features={content} />;
}

function TestContent() {
  const { query } = useRouter();
  const { features } = useFeatures(query.rid as string);
  // @ts-ignore
  const { feature } = useFeature();
  return (
    <div className="test-content h-full">
      <FeatureContent feature={feature} />
      {features && <FeatureData {...features} />}
    </div>
  );
}

const LayoutState = () => {
  const { query } = useRouter();
  const { run } = useRun(query.rid as string);
  const { project } = useProject(run?.project);
  const { errorState } = project ?? {};

  return (
    <div className="errorStatesPage">
      {errorState && <NavMenu errorState={errorState} />}
      <TestContent />
    </div>
  );
};

function RunWithProvider() {
  return (
    <FeatureProvider>
      <TestProvider>
        <Layout>
          <LayoutState />
        </Layout>
      </TestProvider>
    </FeatureProvider>
  );
}

export default ProtectRoute(RunWithProvider);
