import React, { useState } from 'react';
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
} from "components";
import classNames from "classnames";
import {
  useDebounce,
  useFeatures,
  useTests,
  useRun,
  useProject,
  useMedia,
} from "utils/hooks";
import { ProtectRoute } from "context";
import {
  CheckCircleIcon,
  ClockIcon,
  TagSolidIcon,
  BeakerIcon,
  CrossCircleIcon,
  ExclamationSolidIcon,
} from "components/icons";
import { format } from "date-fns";
import { customFormatDuration, getTotalBy } from "utils";
import { Feature, Run as ApiRun, updateTest} from "api";
import { getMedias } from "api";
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
        "hover:bg-gray-100",
        "cursor-pointer",
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

function ErrorStateMenuIcon({ id, errors }) {
  const { query } = useRouter();
  // @ts-ignore
  const { feature } = useFeature();
  const { id: featureId } = feature ?? {};
  const { mutateTests } = useTests({ "deep-populate": true, id: featureId });
  const { run } = useRun(query.rid as string);
  const { project } = useProject(run?.project);
  const { errorState } = project ?? {};

  const handleErrorState = (error) => async (event) => {
    await updateTest({ id, errorStates: [error] });
    mutateTests();
  };

  return (
    <MenuIcon
      items={[
        errorState?.map((error) => ({
          label: error,
          onClick: handleErrorState(error),
          selected: errors ? errors.includes(error) : false,
        })),
      ]}
    />
  );
}

function Search({ selectedFeatureId }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");
  const { query } = useRouter();
  const { features } = useFeatures(query.rid as string);
  // @ts-ignore
  const { setFeature } = useFeature();
  const debouncedSearch = useDebounce(value, 500);
  const [visible, setVisible] = React.useState(false);

  const handleSelect = (feature) => (event) => {
    event.stopPropagation();
    setFeature(feature);
  };

  return (
    <div className="py-4 w-1/2 relative">
      <SearchBox
        inputProps={getInputProps({
          onChange: (e) => console.log(e.target.value),
          onFocus: () => setVisible(true),
          placeholder: "Buscar feature...",
        })}
        resetterProps={getResetterProps({})}
        fullWidth
      />
      <PopOver
        visible={visible}
        className="origin-top-left mt-2 w-full overflow-y-auto border"
        style={{ maxHeight: 400 }}
        onClose={() => setVisible(false)}
      >
        <MenuItemGroup>
          {features?.content
            .filter(({ name }) =>
              name.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
            .map((feature) => (
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

function StepWrapper({ children }) {
  return <ul className="space-y-2 py-4">{children}</ul>;
}

function Step({ status, name, logs }) {
  console.log(logs)
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
      
      {logs.length > 0 ? 
          <Logs {...{ logs }} />
        : ""
      }
    </React.Fragment>
    
  );
}

function Logs({logs}) {
  return (
    
    logs?.map(({test, status, details, media}) =>  (

      <React.Fragment>

          {details != '' ? 
                <li className="flex items-center text-sm" 
                    dangerouslySetInnerHTML={{__html: details}}></li>   
          :""}

          { media != null ? 
              media?.map(() =>  (
                <li className="flex items-center text-sm"> 
                  <MediaButton testId={test} /> 
                </li>
              ))
              :""}
        </React.Fragment>
      )
      )
      );
    }
    
    function MediaButton(testId) {
      const [base64String, setBase64String] = useState("");
      
      return ( 
        <div>
          <button 
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
            type="button" 
            onClick={() => {
              if(base64String == ""){
                      getMedias(testId.testId)
                      .then(res => { 
                        setBase64String(res)
                      })
              };
            }}  
          >View Image </button>
          {base64String!="" ? <Image src={base64String}/> : null }
        </div>
      )
}

const Image = (src) => (
    <img src={src.src} />
  )


function TestCard({ id, name, steps = [], errors }) {
  return (
    <div className="mt-4 border border-gray-300 rounded-md p-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">{name}</div>
          <ErrorStateMenuIcon {...{ id, errors }} />
        </div>
        {errors?.length > 0 && (
          <div className="flex items-center">
            <div className="font-medium text-sm">Excepciones</div>
            {errors.map((error) => (
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
        )}
      </div>
      <StepWrapper>
        {steps?.map(({ id, status, name, logs }) => (
          <Step key={id} {...{ id, status, name, logs }} />
        ))}

        {/* {steps?.map(({ logs }) => (
          <ErrorDetails {...{ logs }} />
        ))} */}
        
      </StepWrapper>
    </div>
  );
}

function ScenarioHeader({ id, name, duration, tags, status, errors }) {
  const formattedDuration = customFormatDuration({ start: 0, end: duration });
  return (
    <div className="flex flex-col border-b -mx-4 py-3 px-4">
      <div className="flex items-center justify-between">
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
        <ErrorStateMenuIcon {...{ id, errors }} />
      </div>
      {errors?.length > 0 && (
        <div className="flex items-center">
          <div className="font-medium text-sm">Excepciones</div>
          {errors.map((error) => (
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
      )}
    </div>
  );
}

function ScenarioContent({ bddType, nodes, description }) {
  if (bddType === "Scenario Outline") {
    return (
      <div className="py-6">
        <div className="text-sm font-medium mb-4">Datos iniciales</div>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        {nodes?.map((test) => {
          const { id, name, nodes: steps, errorStates } = test;
          return (
            <TestCard key={id} {...{ id, name, steps, errors: errorStates }} />
          );
        })}
      </div>
    );
  }

  return (
    <StepWrapper>
      {nodes?.map(({ id, status, name, logs }) => {
        <Step key={id} {...{ id, status, name, logs }} />
        })}

      {/* {nodes?.map(({ logs }) => (
        <ErrorDetails {...{ logs }} />
        ))} */}

    </StepWrapper>
  );
}

function ScenarioCard({ scenario }) {
  const {
    id,
    name,
    status,
    duration,
    categoryNameList,
    description,
    nodes,
    bddType,
    errorStates,
  } = scenario;
  return (
    <div className="rounded-md border px-4 mt-6">
      <ScenarioHeader
        {...{
          id,
          name,
          duration,
          status,
          tags: categoryNameList,
          errors: errorStates,
        }}
      />
      <ScenarioContent {...{ bddType, nodes, description }} />
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
  const child = f ? f.nodes : [];

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
          child?.map((scenario) => {
            return <ScenarioCard key={scenario.id} scenario={scenario} />;
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
  // @ts-ignore
  const { feature } = useFeature();
  const { id } = feature ?? {};
  const { run } = useRun(query.rid as string);

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex space-x-4">
          <span className="font-medium text-lg">{run?.name}</span>
        </div>
      </LayoutHeader>
      <LayoutContent scrollable>
        <SummaryWrapper>
          <Search selectedFeatureId={id} />
          <Summary run={run} />
        </SummaryWrapper>
        <FeatureContent feature={feature} />
      </LayoutContent>
    </Layout>
  );
}

function RunWithProvider() {
  return (
    <FeatureProvider>
      <Run />
    </FeatureProvider>
  );
}

export default ProtectRoute(RunWithProvider);
