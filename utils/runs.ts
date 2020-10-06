import { Run } from "api";
import { sum } from "./number";

export function getTotalBy(key: "feature" | "scenario" | "steps", run?: Run) {
  let filterKey;
  switch (key) {
    case "feature":
      filterKey = "parent";
      break;
    case "scenario":
      filterKey = "child";
      break;
    case "steps":
      filterKey = "grandChild";
      break;
    default:
      break;
  }

  if (run) {
    const quantities = Object.keys(run)
      .map((key) => {
        const sanitizedKey = key.toLowerCase();
        const sanitizedFilterKey = filterKey.toLowerCase();
        const hasParent =
          sanitizedKey.includes(sanitizedFilterKey) &&
          sanitizedKey.includes("length");

        return hasParent ? run[key] : null;
      })
      .filter((quantity) => quantity);

    return sum(quantities);
  }

  return 0;
}
