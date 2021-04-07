import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Badge, CheckCircleIcon, CrossCircleIcon, Layout, LayoutHeader, MediaModal, Spinner, TagSolidIcon, ExclamationSolidIcon } from "src/components";
import { ProtectRoute } from "src/context";
import { customFormatDuration, useFeatures, useProject, useRun, useRuns, useTests } from "src/utils";
import format from "date-fns/format";
import classNames from "classnames";

// @ts-ignore
const Test1Context = createContext();

function Test1Provider(props) {
  const [test1, setTest1] = useState({
    id:null, name:'', description:'', errorStates:[], steps:[], duration:[], tags:[], runName:'', runStartTime:''
})
  const value = { test1, setTest1 };
  return <Test1Context.Provider value={value} {...props} />;
}

function useTest1() {
  const context = useContext(Test1Context);
  if (!context) {
    throw new Error("Test1 must be used within a test1Provider");
  }
  return context;
}

// @ts-ignore
const Test2Context = createContext();

function Test2Provider(props) {
  const [test2, setTest2] = useState({
    id:null, name:'', description:'', errorStates:[], steps:[], duration:[], tags:[], runName:'', runStartTime:''
  },
)
  const value = { test2, setTest2 };
  return <Test2Context.Provider value={value} {...props} />;
}

function useTest2() {
  const context = useContext(Test2Context);
  if (!context) {
    throw new Error("Test2 must be used within a test2Provider");
  }
  return context;
}

// @ts-ignore
const TestActived1Context = createContext();

function TestActived1Provider(props) {
  const [testActived1, setTestActived1] = useState({actived:false, count:0, tname:'', name:'', startTime:'', rid:0,})
  const value = { testActived1, setTestActived1 };
  return <TestActived1Context.Provider value={value} {...props} />;
}

function useTestActived1() {
  const context = useContext(TestActived1Context);
  if (!context) {
    throw new Error("TestActived1 must be used within a TestActived1Provider");
  }
  return context;
}

// @ts-ignore
const TestActived2Context = createContext();

function TestActived2Provider(props) {
  const [testActived2, setTestActived2] = useState({actived:false, count:0, tname:'', name:'', startTime:'', rid:0,})
  const value = { testActived2, setTestActived2 };
  return <TestActived2Context.Provider value={value} {...props} />;
}

function useTestActived2() {
  const context = useContext(TestActived2Context);
  if (!context) {
    throw new Error("TestActived2 must be used within a TestActived2Provider");
  }
  return context;
}

// @ts-ignore
const LoadingContext = createContext();

function LoadingProvider(props) {
  const [loading, setLoading] = useState(false)
  const value = { loading, setLoading };
  return <LoadingContext.Provider value={value} {...props} />;
}

function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("Loading must be used within a LoadingProvider");
  }
  return context;
}


function Logs({ logs }) {
  return logs?.map(({ id, test, status, details, media }) => (
    <React.Fragment key={id}>
      {details != "" ? (
        <li
          className="flex items-center text-sm details-node-html"
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

function Step({ id, status, name, logs }) {
  return (
    <React.Fragment key={id}>
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

function StepWrapper({ children }) {
  return <ul className="space-y-2 py-4">{children}</ul>;
}

function StepsCard({ steps = [] }) {
  return  (
    <div className="mt-4 border border-gray-300 rounded-md p-4">
      <StepWrapper>
        {steps?.map(({ id, status, name, logs }) => (
          <Step key={id} {...{ id, status, name, logs }} />
        ))}
      </StepWrapper>
    </div>
  )
}

function TestCard({name, steps, description, tags, formattedDuration, errorState = [], runName, runStartTime}) {
  return (
    <>
      {name && (
        <>
          <p className="text-md font-medium">{runName}</p>
          <p className="block text-gray-500 text-sm" title="Duration">{format(new Date(runStartTime), "dd/MM/yyyy HH:ss")}</p>
          <div className="w-full">
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
            <span className="block text-gray-500 text-sm" title="Duration">{formattedDuration}</span>
            {errorState.map((error) => (
            <Badge
              key={error}
              IconComponent={
                <div className="text-red-700 w-3 h-3 mr-2">
                  <ExclamationSolidIcon />
                </div>
              }
              className="mr-2"
              uppercase={false}
              color="red"
              label={error}
            />
          ))}
          </div>
          <div className="m-2">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          {steps?.length !== 0 && <StepsCard steps={steps} />}
        </>
      )}
    </>
  )
}

function Test1({test}) {
  const { name, description, errorStates, duration, steps, tags, runName, runStartTime } = test
  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  return (
    <>
      <div className="float-left w-1/2 p-2">
        <TestCard name={name} description={description} steps={steps} tags={tags} errorState={errorStates} runName={runName} runStartTime={runStartTime} formattedDuration={formattedDuration}/>
      </div>
    </>
  )
}

function Test2({test}) {
  const { name, description, errorStates, duration, steps, tags, runName, runStartTime } = test
  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  return (
    <>
      <div className="float-right w-1/2 p-2">
        <TestCard name={name} description={description} steps={steps} tags={tags} errorState={errorStates} runName={runName} runStartTime={runStartTime} formattedDuration={formattedDuration}/>
      </div>
    </>
  )
}

function Content() {
  // @ts-ignore
  const { test1 } = useTest1();

  // @ts-ignore
  const { test2 } = useTest2();

  // @ts-ignore
  const { setLoading } = useLoading()

  useEffect(() => {
    if (!!test1?.id) {
      setLoading(false)
    }
    if (!!test2?.id) {
      setLoading(false)
    }
  }, [test1, test2])
  
  return (
    <div className={`w-full h-full overflow-y-auto`}>
      <Transition
          show={!!test1?.id}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
        <Test1 test={test1}/>
      </Transition>
      <Transition
        show={!!test2?.id}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Test2 test={test2}/>
      </Transition>
    </div>
  )
}

function SetScenariotoContent({count1, count2, scenario, testActived, runName, runStartTime}) {

  const {
    id,
    name,
    description,
    nodes:steps,
    categoryNameList:tags,
    errorStates,
    duration,
  } = scenario;

  // @ts-ignore
  const { setTest1 } = useTest1();
  
  // @ts-ignore
  const { setTest2 } = useTest2();

  useEffect(() => {
    if (testActived === "true1") {
      setTest1({id, name, description, errorStates, duration, steps, tags, runName, runStartTime,})
    }
  }, [count1])

  useEffect(() => {
    if (testActived === "true2") {
      setTest2({id, name, description, errorStates, duration, steps, tags, runName, runStartTime,})
    }
  }, [count2])

  return (
    <></>
  )
}

function ScenarioOutline({ count1, count2, scenario, tname, runName, testActived, runStartTime }) {
  return (
    <>
      {scenario?.bddType === "Scenario Outline" && (
        scenario?.nodes.map((scenario) => {
            if (scenario?.name === tname) {
              return (
                <SetScenariotoContent  count1={count1} count2={count2} key={scenario?.id} scenario={scenario} runName={runName} testActived={testActived} runStartTime={runStartTime}/>
              )
            } else {
            return (
              <></>
            );}
          })
      )}
    </>
  )
}

function Scenario({ count1, count2, scenario, tname, runName, testActived, runStartTime }) {
  if (scenario?.bddType === "Scenario") {
    if (scenario?.name === tname) {
      return (
          <SetScenariotoContent count1={count1} count2={count2} scenario={scenario} runName={runName} testActived={testActived} runStartTime={runStartTime}/>
          )
    } else {
    return (
      <></>
    );}
  } else {
    return (
      <></>
    );
  }
}

function ScenariosContent({count1, count2, id, tname, runName, testActived, startTime:runStartTime}) {
  const { tests } = useTests({ "deep-populate": true, id });
  return (
    <>
      {tests?.content.map(features => {
        const child = features ? features.nodes : [];
        return (
          <>
            {child?.map((scenario) => {
              return (
                <>
                  <ScenarioOutline  count1={count1} count2={count2} key={`${scenario?.id} outline`} scenario={scenario} runStartTime={runStartTime} tname={tname} testActived={testActived} runName={runName} />
                  <Scenario  count1={count1} count2={count2} key={`${scenario?.id}`} scenario={scenario} runStartTime={runStartTime} tname={tname} testActived={testActived} runName={runName} />
                </>
              )
            })}
          </>
        )
      })}
    </>
  )
}

function Features({count1, count2, rid, tname, name:runName, startTime, testActived}) {
  // @ts-ignore
  const { setLoading } = useLoading()
  
  useEffect(() => {
    setLoading(true)
  }, [rid])

  const { features } = useFeatures(rid as string)
  

  return (
    <>
      {features?.content.map(f => {
        const id = f ? f.id : '';
        return (
          <>
            <ScenariosContent count1={count1} count2={count2} key={id} id={id} tname={tname} runName={runName} startTime={startTime} testActived={testActived}/>
          </>
        )
      })}
    </>
  )
}

function ActivateTest1({rid, state, tname, name, startTime,}) {
  // @ts-ignore
  const { setTestActived1 } = useTestActived1();
  useEffect(() => {
    setTestActived1({...state, rid, tname, name, startTime})
  }, [state])

  return (
    <>
    </>
  )
}

// interface RadioButton1Props {
//   i1?: string;
//   onChange?: any;
//   tname?:string; 
//   name?:string; 
//   status?:string; 
//   startTime?:string;
//   rid?:string;
// }

const RadioButton1 = ({ rid, i1, tname, name, startTime, }) => {
  const [state, setstate] = useState({actived:false,count:0})

  const count = Math.random()
  const handleCheckbox1 = (e) => {
    setstate({actived:e.target.checked,count:count})
  };

  return (
    <>
      <input type="radio" name="radio1" id={i1} className="form-radio border-blue-500 h-4 w-4 cursor-pointer mr-2" onClick={handleCheckbox1}/>
      {state.actived && <ActivateTest1 rid={rid} state={state} tname={tname} name={name} startTime={startTime}/>}
    </>
  )
}

function ActivateTest2({rid, state, tname, name, startTime,}) {
  // @ts-ignore
  const { setTestActived2 } = useTestActived2();
  useEffect(() => {
    setTestActived2({...state, rid, tname, name, startTime})
  }, [state])

  return (
    <>
    </>
  )
}

// interface RadioButton2Props {
//   i2?: string;
//   onChange?: any;
//   tname?:string; 
//   name?:string; 
//   status?:string; 
//   startTime?:string;
//   rid?:string;
// }

const RadioButton2 = ({ rid, i2, tname, name, startTime, }) => {
  const [state, setstate] = useState({actived:false,count:0})

  const count = Math.random()
  const handleCheckbox2 = (e) => {
    setstate({actived:e.target.checked,count:count})
  };

  return (
    <>
      <input type="radio" name="radio2" id={i2} className="form-radio border-blue-500 h-4 w-4 cursor-pointer mr-2" onClick={handleCheckbox2}/>
      {state.actived && <ActivateTest2 rid={rid} state={state} tname={tname} name={name} startTime={startTime}/>}
    </>
  )
}

function RunItem({ i1, i2, rid, tname, name, status, startTime, }) {
  // @ts-ignore
  const { testActived1 } = useTestActived1();

  // @ts-ignore
  const { testActived2 } = useTestActived2();

  const { actived:actived1, rid:rid1, count:count1, tname:tname1, name:name1, startTime:startTime1, } = testActived1
  const { actived:actived2, rid:rid2, count:count2, tname:tname2, name:name2, startTime:startTime2, } = testActived2

  return (
    <>
      <li className={`p-2`}>
        <p className="text-sm font-medium">
          {name}
        </p>
        <p className="text-xs">
            {format(new Date(startTime), "dd/MM/yyyy HH:ss")}  
        </p>
        <div className="flow-root">
          <div className="float-left">
            <RadioButton1 i1={i1} rid={rid} tname={tname} name={name} startTime={startTime}/>
            <RadioButton2 i2={i2} rid={rid} tname={tname} name={name} startTime={startTime}/>
          </div>
          <span className="float-right">
            <Badge
              label={status}
              color={status === "pass" ? "green" : "red"}
            />
          </span>
        </div>
      </li>
      {actived1 && <Features rid={rid1} count1={count1} count2={count2} tname={tname1} name={name1} startTime={startTime1} testActived={actived1 ? "true1" : "false1"}/>}
      {actived2 && <Features rid={rid2} count1={count1} count2={count2} tname={tname2} name={name2} startTime={startTime2} testActived={actived2 ? "true2" : "false2"}/>}
    </>
  );
}

function NavMenu({runs, tname }) {
  return (
    <div className="w-100 xl:w-64 overflow-y-auto flex-shrink-0 overflow-x-hidden border-r border-gray-300">
      <div className="p-2">
        <span>{tname}</span>
        <div className="float-right">
          <button className="cursor-default text-white text-sm bg-blue-500 px-2 font-semibold rounded focus:outline-none">{runs?.length}</button>
        </div>
      </div>
      <nav>
          <ul>
            {runs?.map((runs, i) => {
            const {id, name, status, startTime} = runs
              return (
                <>
                  <RunItem
                    i1={Math.random()}
                    i2={Math.random()}
                    key={id}
                    rid={id}
                    tname={tname}
                    name={name}
                    status={status}
                    startTime={startTime}
                  />
                </>
              );
            })}
          </ul>
      </nav>
    </div>
  );
}

function Dropdown({run, runs}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activedStyle, setActivedStyle] = useState(false)

  useEffect(() => {
    if (runs?.content.length >= 8) {
      setActivedStyle(true)
    }
  }, [runs])

  const handleFocus = (e) => {
    setIsOpen(true)
  }

  const handleBlur = (e) => {
    setIsOpen(false)
  }

  return (
    <>
      <li className="self-center relative">
        <button type="button" onFocus={handleFocus} onBlur={handleBlur} className="transition duration-200 hover:color-gray-900 focus:outline-none">
          {run?.name}
        </button>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div style={{width:"355px", height: activedStyle ? "80vh" : "auto"}} className={`absolute left-0 mt-2 origin-top-right`}>
            <nav style={{height: "70%"}} className="rounded-md border">
            <div style={{right: "-38px"}} className="inline-block bg-white absolute border py-1 px-2 shadow-sm rounded-md cursor-pointer transition duration-200 hover:bg-gray-100">
              <span className="leading-none text-xl font-medium" aria-hidden="true">&times;</span>
            </div>
              <ul className="h-full overflow-y-overlay rounded-md bg-white">
                {runs?.content.map(run => {
                  return (
                  <a  className="w-full" key={run?.id} href={`../../${run?.id}`}>
                    <li className={`p-2 text-sm transition duration-200 hover:bg-gray-200`}>{run?.name}</li>
                  </a>
                  )
                })}
              </ul>
            </nav>
          </div>
        </Transition>
      </li>
      <span className="self-center w-3 mx-2">
        <img className="w-full cursor-pointer" src={isOpen ? "/assets/arrow-down.png" : "/assets/arrow-right.png" }  alt={isOpen ? "arrow-down" : "arrow-right"}/>
      </span>
    </>
  )
}

function Breadcrumd({name, run, runs}) {
  return (
    <nav className="w-full">
      <ol className="flex w-full text-grey">
        <li className="flex self-center">
          <button className="w-full font-semibold cursor-default focus:outline-none"><a  href={`../../`}>{`${name}`}</a></button>
          <span className="self-center w-3 mx-2">
            <img className="w-full" src={"/assets/arrow-right.png" }  alt={"arrow-right"}/>
          </span>
        </li>
        <Dropdown run={run} runs={runs} />
      </ol>
    </nav>
  )
}

function LayoutCompare() {
    // @ts-ignore
    const { loading } = useLoading()

    const { query } = useRouter()
    const { id, tname, rid } = query
    
    const { run } = useRun(rid as string);
    const { project } = useProject(id as string)
    const { runs } = useRuns({
      projectId: id as string,
    });
    return (
      <div className={`${loading && "cursor-wait"}`}>
        <Layout>
          <LayoutHeader>
            {project?.name !== undefined && <Breadcrumd name={project.name} run={run} runs={runs}/>}
          </LayoutHeader>
          <div className="md:flex lg:flex xl:flex h-screen bg-white overflow-hidden">
            <NavMenu tname={tname} runs={runs?.content.map(r => r )} />
            <Content />
          </div>
        </Layout>
      </div>
    )
}

function Compare() {

  return (
    <TestActived1Provider>
      <TestActived2Provider>
        <Test1Provider>
          <Test2Provider>
            <LoadingProvider>
              <LayoutCompare />
            </LoadingProvider>
          </Test2Provider>
        </Test1Provider>
      </TestActived2Provider>
    </TestActived1Provider>
  );
}
  
export default ProtectRoute(Compare);
