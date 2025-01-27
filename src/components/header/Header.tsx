import { Link } from "react-router-dom";
import { ModeToggle } from "../theme/ThemeModeToggle";
import { IoCalendarSharp } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";
import { FaHouseUser } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaHistory } from "react-icons/fa";

interface Props extends React.HTMLProps<HTMLElement> {
  className?: string;
}

interface MainItemProps extends Props {
  to: string;
  iconClassName?: string;
  title: string;
}

export default function Header() {
  return (
    <header className="bg-slate-50 dark:bg-zinc-800 shadow-md">
      <div className=" mx-auto p-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-teal-500">Kamath Residency</h1>
        <div className="flex gap-2 justify-center items-center">
          <nav>
            <ul className="flex space-x-6">
              <NavMainItems to="/" title="Booking">
                <IoCalendarSharp />
              </NavMainItems>
              <NavMainItems to="/" title="Room">
                <FaBuilding />
              </NavMainItems>
              <NavMainItems to="/" title="User">
                <FaHouseUser />
              </NavMainItems>
              <NavMainItems to="/" title="Payments">
                <MdPayment />
              </NavMainItems>
              <NavMainItems to="/" title="History">
                <FaHistory />
              </NavMainItems>
            </ul>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

const NavMainItems: React.FC<MainItemProps> = (props) => {
  return (
    <li className="text-teal-900 dark:text-white">
      <Link
        to={props.to}
        className="flex justify-center items-center gap-1 hover:text-teal-500 hover:scale-105 transition-all ease-in-out"
      >
        <div className="w-4 h-4">{props.children}</div>
        <div className="">{props.title}</div>
      </Link>
    </li>
  );
};
