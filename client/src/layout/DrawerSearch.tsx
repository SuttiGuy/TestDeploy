import Drawer from "../components/Drawer-Search";
import { Outlet } from "react-router-dom";

const DashBoard = () => {
  return (
      <div className="flex">
        <Drawer />
        <div className="w-full flex items-center justify-center">
          <div className="md:w-1.5/4 w-[80%]">
            <Outlet />
          </div>
        </div>
      </div>
  );
};

export default DashBoard;
