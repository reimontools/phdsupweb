// npm install react-icons --save
import { BiEdit } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { MdClose } from "react-icons/md";
import { RiAliensLine } from "react-icons/ri";
import { BiTrash } from "react-icons/bi";
import { IoMdPersonAdd , IoMdSearch} from "react-icons/io";
// import { IoSearchCircle } from "react-icons/io5";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

export const SMALL_SCREEN_SIZE = 500;
export const MEDIUM_SCREEN_SIZE = 768;
export const SMALL_SCREEN_SIZE_PX = SMALL_SCREEN_SIZE + "px";
export const MEDIUM_SCREEN_SIZE_PX = MEDIUM_SCREEN_SIZE + "px";

export const getColorByFamily = family => {
    switch(family) {
        case "close": return "#666666";
        case "add": return "#ced922";
        case "addPerson": return "#ced922";
        case "check": return "#663165";
        case "dobleCheck": return "#FFFFFF";
        case "edit": return "#663165";
        case "save": return "#663165";
        case "delete": return "#bb3345";
        case "remove": return "#bb3345";
        case "search": return "#0d5f1b";
        default: return "#663165"
    };
};

export const getIconByFamily = family => {
    switch(family) {
        case "close": return <MdClose />;
        case "add": return <GoPlus />;
        case "addPerson": return <IoMdPersonAdd />;
        case "check": return <FaCheck />;
        case "dobleCheck": return <FaCheckDouble />;
        case "edit": return <BiEdit />;
        case "save": return <IoMdPersonAdd />;
        case "delete": return <BiTrash />;
        case "remove": return <MdClose />;
        case "search": return <IoMdSearch />;
        default: return <RiAliensLine />
    };
};
