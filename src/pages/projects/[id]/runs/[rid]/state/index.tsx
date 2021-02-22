import React, { useEffect, useState } from "react";
import {
  Layout,
  Badge,
  Spinner,
  MediaModal,
} from "src/components";
import classNames from "classnames";
import {
  useFeatures,
  useTests,
  useRun,
  useProject,
} from "src/utils/hooks";
import { ProtectRoute } from "src/context";
import {
  CheckCircleIcon,
  ClockIcon,
  BeakerIcon,
  CrossCircleIcon,
  ExclamationSolidIcon,
} from "src/components";
import { customFormatDuration } from "src/utils";
import { Feature, Run as ApiRun, Test } from "src/api";
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

// @ts-ignore
const ScrollContext = React.createContext();

function ScrollProvider(props) {
  const [scroll, setScroll] = React.useState(false);
  const value = { scroll, setScroll };
  return <ScrollContext.Provider value={value} {...props} />;
}

function useScroll() {
  const contextScroll = React.useContext(ScrollContext);
  if (!contextScroll) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return contextScroll;
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
        <span>
          <div>{errorState.length}</div>
        </span>
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

function StepWrapper({ children }) {
  return <ul className="space-y-2 py-4">{children}</ul>;
}

function Step({ status, name, logs }) {
  return (
    <React.Fragment>
      <li className="flex items-center text-sm">
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

      {logs.length > 0 ? <Logs {...{ logs }} /> : ""}
    </React.Fragment>
  );
}

function Logs({ logs }) {
  return logs?.map(({ test, status, details, media }) => (
    <React.Fragment>
      {details != "" ? (
        <li
          className="flex items-center text-sm"
          dangerouslySetInnerHTML={{ __html: details }}
        ></li>
      ) : (
        ""
      )}

      {media != null
        ? media?.map(() => (
            <li key={test} className="flex items-center text-sm">
              <MediaModal {...{ testId: test }} />
            </li>
          ))
        : ""}
    </React.Fragment>
  ));
}

function StepsCard({ steps = [] }) {
  return (
    <div className="mt-4 border border-gray-300 rounded-md p-4">
      <StepWrapper>
        {steps?.map(({ id, status, name, logs }) => (
          <Step key={id} {...{ id, status, name, logs }} />
        ))}
      </StepWrapper>
    </div>
  );
}

function TestCard({ id, name, errorStates, duration, steps, fetureName }) {
  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  const [checkbox, setCheckbox] = useState(false);
  const count = Math.random();
  const handleCheckbox = (e) => {
    setCheckbox(e.target.checked);
  };
  return (
    <>
      <input
        type="checkbox"
        id={`toggle${count}`}
        className="d-none"
        onChange={handleCheckbox}
      />
      <label className="cursor-pointer" htmlFor={`toggle${count}`}>
        <div className="testCard">
          <div>
            <span>{name}</span>
            <span className="feature-item-name">Feture: {fetureName}</span>
          </div>
          <div>
            <p>id: {id}</p>
            {/* <div className='text-red-700 w-3 h-3 mr-2'>{errorStates}</div> */}
            <div className="inline-block">
              <div className="flex items-center">
                <div className="w-4 h-4 text-gray-500 mr-2">
                  <ClockIcon />
                </div>
                {formattedDuration ? (
                  <span
                    className="block text-gray-500 text-sm"
                    title="Duration"
                  >
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
          {checkbox && <StepsCard steps={steps} />}
        </div>
      </label>
    </>
  );
}

function ScenarioContent({ scenario1, fetureName }) {
  const { nodes: scenario2, bddType } = scenario1;
  return (
    <>
      {scenario2?.map((tests) => {
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
        if (errorStates?.includes(errorTest)) {
          // @ts-ignore
          const { setScroll } = useScroll();
          setScroll(true)
          return (
            <TestCard
              key={id}
              {...{
                id,
                name,
                errorStates,
                duration,
                endTime,
                steps,
                fetureName,
              }}
            />
          );
        }
        // else {
        //   return <TestEmptyPlaceholder />;
        // }
      })}
    </>
  );
}

function Scenario({ features }) {
  const { id } = features ?? {};
  const { tests, isLoading } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  // const type = f ? f.bddType : [];
  const child = f ? f.nodes : [];
  const name = f ? f.name : {};

  // child.map((scenario) => {
  //   const type2 = scenario ? scenario.bddType : [];
  // });

  if (isLoading) {
    return (
      <div className="h-full flex-center">
        <Spinner className="h-10 w-10 text-gray-500" />
      </div>
    );
  } else {
    if (child) {
      return child?.map((scenario1) => {
        return (
          <ScenarioContent
            key={scenario1.id}
            scenario1={scenario1}
            fetureName={name}
          />
        );
      });
    }
  }
}

function Features({ feature }) {
  // @ts-ignore
  const { scroll } = useScroll();  
  return (
    <div className={`h-full ${scroll && 'overflow-y-auto'}`}>
      {feature?.map((features) => {
        return <Scenario key={features.id} features={features} />;
      })}
    </div>
  );
}

function Content() {
  const { query } = useRouter();
  const { features } = useFeatures(query.rid as string);
  // @ts-ignore
  const { feature } = useFeature();
  return (
    <div className="test-content h-full">
      <Features feature={feature} />
      {features && <SetFeatues features={features.content} /> }
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
      <Content />
    </div>
  );
};

function RunWithProvider() {
  return (
    <FeatureProvider>
      <TestProvider>
        <ScrollProvider>
          <Layout>
            <LayoutState />
          </Layout>
        </ScrollProvider>
      </TestProvider>
    </FeatureProvider>
  );
}

export default ProtectRoute(RunWithProvider);
