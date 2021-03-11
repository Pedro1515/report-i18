import { useRouter } from "next/router";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import { Layout, LayoutHeader, Badge, TagSolidIcon, Spinner, CheckCircleIcon, CrossCircleIcon, MediaModal } from "src/components";
import { ProtectRoute } from "src/context";
import { customFormatDuration, useFeatures, useProject, useRuns, useTests } from "src/utils";
import classNames from "classnames";

// @ts-ignore
const TestContext = React.createContext();

function TestProvider(props) {
  const [test, setTest] = React.useState({test1:{steps: [], bddType: {}}, test2:{steps: [], bddType: {}}});
  const value = { test, setTest };
  return <TestContext.Provider value={value} {...props} />;
}

function useTest() {
  const context = React.useContext(TestContext);
  if (!context) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}

function Logs({ logs }) {
  return logs?.map(({ test, status, details, media }) => (
    <React.Fragment key={test}>
      {details != "" ? (
        <li
          key={test}
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

function Content() {
  // @ts-ignore
  const { test } = useTest();
  const {name:name1, steps:steps1, description:description1, duration:duration1, tags:tags1, bddType:bddType1} = test?.test1
  const {name:name2, steps:steps2, description:description2, duration:duration2, tags:tags2, bddType:bddType2} = test?.test2
  const formattedDuration1 = customFormatDuration({ start: 0, end: duration1 });
  const formattedDuration2 = customFormatDuration({ start: 0, end: duration2 });
  
  return (
    <>
      {name1 && (
        <>
          <div className="float-left w-1/2 p-2">
            {test?.test1 && (
              <>
                <div className="w-full">
                  <span>{name1}</span>
                  {tags1?.map((tag) => (
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
                  <span className="block text-gray-500 text-sm" title="Duration">{formattedDuration1}</span>
                </div>
                <div className="m-2">
                  <div dangerouslySetInnerHTML={{ __html: description1 }} />
                </div>
                {steps1?.length !== 0 && <StepsCard steps={steps1} />}
              </>
            )}
          </div>
        </>
      )}
      {name2 && (
        <>
          <div className="float-right w-1/2 p-2">
            <div className="w-full">
              <span>{name2}</span>
              {tags2?.map((tag) => (
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
              <span className="block text-gray-500 text-sm" title="Duration">{formattedDuration2}</span>
            </div>
            <div className="m-2">
              <div dangerouslySetInnerHTML={{ __html: description2 }} />
            </div>
            {steps2.length !== 0 && <StepsCard steps={steps2} />}
          </div>
        </>
      )}
    </>
  )
}

function Scenario2Item({scenario2}) {
  const {name, nodes:steps, status, description, duration, bddType, categoryNameList:tags} = scenario2
  
  const count1 = Math.random();
  const count2 = Math.random();

  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)

  const handleCheckbox1 = (e) => {
    setChecked1(e.target.checked);
  };

  const handleCheckbox2 = (e) => {
    setChecked2(e.target.checked);
  };


  // @ts-ignore
  const { test, setTest } = useTest();

  const handleTest1 = (name, steps, description, duration, bddType, tags) => {
    if (!checked1) {
      setTest({...test, test1:{name:name, steps:steps, description:description, duration:duration, bddType:bddType, tags:tags}})
    } else {
      setTest({...test, test1:{name:'', steps: []}})
    }
  }
  const handleTest2 = (name, steps, description, duration, bddType, tags) => {
    if (!checked2) {
      setTest({...test, test2:{name:name, steps:steps, description:description, duration:duration, bddType:bddType, tags:tags}})
    } else {
      setTest({...test, test2:{}})
    }
  }
  
  return (
    <>
      <input type="checkbox" id={`toogle1${count1}`} className="hidden" onClick={handleCheckbox1}/>
      <input type="checkbox" id={`toogle2${count2}`} className="hidden" onClick={handleCheckbox2}/>
      <div className="px-2 pt-1">
          <div className={`bg-blue-500 text-white rounded bg-white p-2`}>
            <div>
                <div className="mb-2 text-sm font-medium">{name}</div>
            </div>
            <div className="flow-root">
              <div className="float-right text-sm">
                <label className={`${checked1 && "bg-gray-800 text-white"} mx-1 bg-white text-black text-sm bg-gray-200 px-2 font-semibold rounded cursor-pointer transition duration-200 hover:bg-gray-400`} onClick={()=>{handleTest1(name, steps, description, duration, bddType, tags)}} htmlFor={`toogle1${count1}`}>
                  1
                </label>
                <label className={`${checked2 && "bg-gray-800 text-white"} mx-1 bg-white text-black text-sm bg-gray-200 px-2 font-semibold rounded cursor-pointer transition duration-200 hover:bg-gray-400`} onClick={()=>{handleTest2(name, steps, description, duration, bddType, tags)}} htmlFor={`toogle2${count2}`}>
                  2
                </label>
              </div>
              <span className="float-left text-sm">
                <Badge
                  label={status}
                  color={status === "pass" ? "green" : "red"}
                  />
              </span>
            </div>
          </div>
      </div>
    </>
  )
}

function Scenario1Item({scenario1}) {
  const {name, nodes:steps, status, description, duration, bddType, categoryNameList} = scenario1
  
  const count1 = Math.random();
  const count2 = Math.random();

  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)

  const handleCheckbox1 = (e) => {
    setChecked1(e.target.checked);
  };

  const handleCheckbox2 = (e) => {
    setChecked2(e.target.checked);
  };


  // @ts-ignore
  const { test, setTest } = useTest();

  const handleTest1 = (name, steps, description, duration, bddType) => {
    if (!checked1) {
      setTest({...test, test1:{name:name, steps:steps, description:description, duration:duration, bddType:bddType}})
    } else {
      setTest({...test, test1:{name:'', steps: []}})
    }
  }
  const handleTest2 = (name, steps, description, duration, bddType) => {
    if (!checked2) {
      setTest({...test, test2:{name:name, steps:steps, description:description, duration:duration, bddType:bddType}})
    } else {
      setTest({...test, test2:{}})
    }
  }
  
  return (
    <>
      <input type="checkbox" id={`toogle1${count1}`} className="hidden" onClick={handleCheckbox1}/>
      <input type="checkbox" id={`toogle2${count2}`} className="hidden" onClick={handleCheckbox2}/>
      <div className="px-2 pt-1">
          <div className={`bg-blue-500 text-white rounded bg-white p-2`}>
            <div>
                <div className="text-sm font-medium">{name}</div>
            </div>
            <div className="flow-root">
              <div className="float-right text-sm">
                <label className={`${checked1 && "bg-gray-800 text-white"} mx-1 bg-white text-black text-sm bg-gray-200 px-2 font-semibold rounded cursor-pointer transition duration-200 hover:bg-gray-400`} onClick={()=>{handleTest1(name, steps, description, duration, bddType)}} htmlFor={`toogle1${count1}`}>
                  1
                </label>
                <label className={`${checked2 && "bg-gray-800 text-white"} mx-1 bg-white text-black text-sm bg-gray-200 px-2 font-semibold rounded cursor-pointer transition duration-200 hover:bg-gray-400`} onClick={()=>{handleTest2(name, steps, description, duration, bddType)}} htmlFor={`toogle2${count2}`}>
                  2
                </label>
              </div>
              <span className="float-left text-sm">
                <Badge
                  label={status}
                  color={status === "pass" ? "green" : "red"}
                  />
              </span>
            </div>
          </div>
      </div>
    </>
  )
}

function Tests({ featureId:id }) {
  const { tests } = useTests({ "deep-populate": true, id });
  const [f] = tests?.content ?? [];
  const child = f ? f.nodes : [];
  return(
    <>
      <nav>
        <ul>
          {child?.map(scenarios1 => {
            const { nodes: scenario, bddType:bddType1 } = scenarios1;
            if (bddType1 === "Scenario Outline") {
              return (
                scenario?.map(scenarios2 => {
                  return (
                    <li key={scenarios2?.id}>
                      <Scenario2Item scenario2={scenarios2}/>
                    </li>
                  )
                })
                )
              } else {
                return (
                <li key={scenarios1?.id}>
                 <Scenario1Item scenario1={scenarios1}/>
                </li>
              )
            }
          })}
        </ul>
      </nav>
    </>
  )
}

function FeatureItem({features}) {
  const [actived, setActived] = useState(false)
  const { id, name, status } = features ?? {};
  return (
    <>
      <li className={`rounded border-2 border-blue-500 mt-2 mx-1 px-2 py-1 cursor-pointer transition duration-200 hover:bg-gray-100`} onClick={()=>{setActived(!actived)}}>
        <div>
            <div className="text-sm font-medium">{name}</div>
        </div>
        <div className="flow-root">
          {!!status && (
            <span className="inline-block text-sm">
              <Badge label={status} color={status === "pass" ? "green" : "red"} />
            </span>
          )}
          <span className="w-5 p-1 inline-block float-right">
            <img className="w-full cursor-pointer opacity-50" src={actived ? "/assets/arrow-down.png" : "/assets/arrow-right.png" }  alt={actived ? "arrow-down" : "arrow-right"}/>
          </span>
        </div>
      </li>
      {actived && <Tests featureId={id} />}
    </>
  )
}

function RunItem({ rid, name, status, startTime, isActive }) {
  const [actived, setActived] = useState(false)
  const { features } = useFeatures(rid as string);
  const feature = features?.content
  return (
    <>
        <li className={`${actived ? "border-l-2 border-indigo-600" : "border-b"} p-2 cursor-pointer transition duration-200 hover:bg-gray-100`} onClick={()=>{setActived(!actived)}}>
          <div className="w-full">
            <div className="text-sm font-medium">
              {name}
            </div>
          </div>
          <div className="w-full">
            <p className="text-sm inline-block">
              {format(new Date(startTime), "dd/MM/yyyy HH:ss")}  
            </p>
            <span className="text-sm ml-3">
              <Badge
                label={status}
                color={status === "pass" ? "green" : "red"}
              />
            </span>
            <span className="w-5 p-1 mt-1 float-right">
              <img className="w-full cursor-pointer opacity-50" src={actived ? "/assets/arrow-down.png" : "/assets/arrow-right.png" }  alt={actived ? "arrow-down" : "arrow-right"}/>
            </span>
          </div>
        </li>
        <nav>
            {actived && (
            <ul>
                {feature?.map(f => <FeatureItem key={f?.id} features={f}/>)}
            </ul>
            )}
        </nav>
    </>
  );
}

function NavMenu({runs}) {
  return (
      <nav>
          <ul>
            {runs?.map((runs) => {
            const {id, name, status, startTime} = runs
              return (
                <RunItem
                  key={id}
                  rid={id}
                  name={name}
                  status={status}
                  startTime={startTime}
                  isActive={true}
                />
              );
            })}
          </ul>
    </nav>
  );
}

function LayoutCompare() {
  const { query, push, asPath } = useRouter();
  const { project } = useProject(query.id as string);
  const { runs } = useRuns({
    projectId: query.id as string,
  });
  const rs = runs?.content
  const goToProject = () => push(`/projects/${project?.id}`);
  return (
        <>
            <LayoutHeader>
              <div className="flex space-x-4">
                <nav className="container">
                  <ol className="flex text-grey">
                    {project?.name !== undefined &&
                    <li className="px-2"><a onClick={goToProject} className="cursor-pointer font-semibold">{`${project?.name}`}</a></li>}
                  </ol>
                </nav>
              </div>
            </LayoutHeader>
            <div className="md:flex lg:flex xl:flex h-screen bg-white overflow-hidden">
                <div className="w-100 md:w-64 lg:w-64 xl:w-64 overflow-y-auto flex-shrink-0 overflow-x-hidden border">
                  <NavMenu runs={rs} />
                </div>
                <div className="w-full h-full overflow-y-auto">
                  <Content />
                </div>
            </div>
        </>
    )
}

function Compare() {
  return (
    <TestProvider>
      <Layout>
        <LayoutCompare />
      </Layout>
    </TestProvider>
  );
}

export default ProtectRoute(Compare);
