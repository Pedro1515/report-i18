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
const ModalContext = React.createContext();

function ModalProvider(props) {
  const [modal, setModal] = React.useState({
    modalOpen: false, 
    run:'', 
    project:'',
    testName:'',
    description:'',
  });
  const value = { modal, setModal };
  return <ModalContext.Provider value={value} {...props} />;
}

function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
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
    <nav>
      <div className="p-4">
        <span>States</span>
        <p className="float-right text-white text-sm bg-blue-500 px-2 font-semibold rounded">
          {errorState.length}
        </p>
      </div>
      <ul>
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

function TestCard({ id, name, errorStates, duration, steps, runName, fetureName }) {
  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  const [checked, setChecked] = useState(false);
  const count = Math.random();
  const handleCheckbox = (e) => {
    setChecked(e.target.checked);
  };

  // @ts-ignore
  const { modal, setModal } = useModal();
  const { modalOpen, testName } = modal
  
  const handleModal = (name, runName) => {
    setModal({
      ...modal,
      modalOpen: true,
      testName: name,
      run: runName,
    })
  }
  return modalOpen ? (<FormModal />) : (
    <>
      <input
        type="checkbox"
        id={`toggle${count}`}
        className="hidden"
        onChange={handleCheckbox}
        />
      <div className="m-3 p-2 rounded border">
        <div>
          <span>{name}</span>
          {/* <span className="float-right text-white text-sm bg-blue-500 px-2 inline-flex leading-5 font-semibold rounded">Feture: {fetureName}</span> */}
          <div className="h-8 flex float-right">
            <span className="mr-3">
              <label htmlFor={`toggle${count}`}>
                <img className="w-8 p-1 cursor-pointer rounded opacity-75  transition duration-300 hover:bg-gray-200" src={checked ? "/assets/visible.png" : "/assets/invisible.png"}  alt={checked ? "invisible" : "visible"}/>
              </label>
            </span>
            <span className="mr-3">
                <button className="focus:outline-none" onClick={(e) => {handleModal(name, runName)}}>
                  <img className="w-8 p-1 rounded opacity-90  transition duration-300 hover:bg-gray-200" src="/assets/share-option.png" alt="visible"/>
                </button>
            </span>
          </div>
        </div>
        <div className="flex">
          <span className="px-2 inline-flex text-xs leading-5 font-medium rounded border tracking-wide items-center m-2">id: {id}</span>
          <div className="inline-flex leading-5 rounded tracking-wide items-center m-2">
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
        {checked && <StepsCard steps={steps} />}
      </div>
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
          reportName:runName,
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
                runName,
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

  if (isLoading) {
    return (
      <div className="w-full h-full flex-center">
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
    <>
      <Features feature={feature} />
      {features && <SetFeatues features={features.content} /> }
    </>
  );
}

const LayoutState = () => {
  const { query } = useRouter();
  const { run } = useRun(query.rid as string);
  const { project } = useProject(run?.project);
  const { errorState, name } = project ?? {};

  // @ts-ignore
  const { modal, setModal } = useModal();
  // const { project:projectName } = modal

  useEffect(() => {
    setModal({...modal, project:name})  
  }, [name])
  
  return (
    <div className="md:flex lg:flex xl:flex h-screen bg-white overflow-hidden">
        <div className="w-100 md:w-64 lg:w-64 xl:w-64 overflow-y-auto flex-shrink-0 overflow-x-hidden border">
          {errorState && <NavMenu errorState={errorState} />}
        </div>
        <div className="w-full h-full">
          <Content />
        </div>
    </div>
  );
};

function FormModal() {
  // @ts-ignore
  const { modal, setModal } = useModal();
  const { modalOpen, testName, run, project } = modal
  const handleCloseModal = () => {
    setModal({...modal,modalOpen:false})
  }
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* <!--
        Background overlay, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      --> */}
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal}></div>
          </div>

          {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {/* <!--
        Modal panel, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      --> */}
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-11/12 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Form
                  </h3>
                  <div className="mt-3">
                    <input
                      className="text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Project"
                      value={project}
                    />
                  </div>
                  <div className="mt-3">
                    <input
                      className="text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Run"
                      value={run}
                    />
                  </div>
                  <div className="mt-3">
                    <input
                      className="text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Test name"
                      value={testName}
                    />
                  </div>
                  <div className="mt-3">
                    <textarea
                      className="h-20 text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                      placeholder="Description"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={handleCloseModal}
                type="button"
                className="mr-6 bg-blue-500 text-white font-medium py-1 px-4 rounded transition duration-300 hover:bg-blue-600"
              >
                Send
              </button>
              <button
                onClick={handleCloseModal}
                type="button"
                className="mr-2 text-sm text-dark border font-medium py-0.5 px-2 rounded transition duration-300 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
function RunWithProvider() {
  return (
    <FeatureProvider>
      <TestProvider>
        <ScrollProvider>
          <ModalProvider>
            <Layout>
              <LayoutState />
            </Layout>
          </ModalProvider>
        </ScrollProvider>
      </TestProvider>
    </FeatureProvider>
  );
}

export default ProtectRoute(RunWithProvider);
