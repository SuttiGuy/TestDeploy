import Drawer from "../components/Drawer";
import { Outlet } from "react-router-dom";

const DashBoard = () => {
  return (
    <div className="flex sm:flex-col md:flex-row md:px-5 items-start">
      <div>
        <Drawer />
      </div>
      <div className="w-full sm:px-10 md:w-full lg:w-3/4 xl:w-3/4 flex flex-col mt-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;
