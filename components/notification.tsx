import classNames from "classnames";

export function Notification() {
  return (
    <div
      className={classNames(
        "absolute",
        "max-w-md",
        "bg-white",
        "flex",
        "rounded-md",
        "p-4",
        "shadow-lg",
        "items-center",
        "border",
        "top-0",
        "right-0",
        "m-4"
      )}
    >
      <div className="flex flex-col">
        <span className="leading-5 text-gray-800 font-medium">
          Successfully saved!
        </span>
        <span className="text-gray-600 leading-8">
          Anyone with a link can now view this file.
        </span>
      </div>
    </div>
  );
}
