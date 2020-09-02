import { SelectorIcon } from "components/icons";

export function Avatar({ name, role }) {
    return (
      <div className="flex items-center my-8 justify-around py-2 rounded hover:shadow-sm hover:border-gray-300 border-transparent border cursor-pointer hover:bg-white duration-100">
        <div className="flex items-center">
          <img src="/assets/avatar.png" className="rounded-full h-10" />
          <div className="flex flex-col text-sm truncate ml-4">
            <span className="font-medium leading-7">Juan Spoleti</span>
            <span className="text-gray-500 text-xs uppercase">admin</span>
          </div>
        </div>
        <div className="w-5 h-5 text-gray-500">
          <SelectorIcon />
        </div>
      </div>
    );
  }