// npm install react-icons --save
import { BiEdit } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { MdClose, MdMoreVert } from "react-icons/md";
import { RiAliensLine } from "react-icons/ri";
import { BiTrash } from "react-icons/bi";
import { IoMdPersonAdd , IoMdSearch, IoIosAdd, IoIosArrowRoundBack, IoIosMore } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export const SMALL_SCREEN_SIZE = 500;
export const MEDIUM_SCREEN_SIZE = 768;
export const SMALL_SCREEN_SIZE_PX = SMALL_SCREEN_SIZE + "px";
export const MEDIUM_SCREEN_SIZE_PX = MEDIUM_SCREEN_SIZE + "px";

export const LOWERCASEREGEX = /(?=.*[a-z])/;
export const UPPERCASEREGEX = /(?=.*[A-Z])/;
export const NUMERICREGEX = /(?=.*[0-9])/;

export const PRIMARY_COLOR = "#663165";
export const SECONDARY_COLOR = "#fff";

export const getColorByFamily = family => {
    switch(family) {
        case "close": return PRIMARY_COLOR;
        case "add": return "#CED922";
        case "addPerson": return "#CED922";
        case "check": return "#ced922";
        case "dobleCheck": return "#FFFFFF";
        case "edit": return PRIMARY_COLOR;
        case "ok": return "#754B74";
        case "save": return "#0E70B";
        case "delete": return PRIMARY_COLOR;
        case "remove": return PRIMARY_COLOR;
        case "search": return "#0D5F1B";
        case "password": return PRIMARY_COLOR;
        case "more": return PRIMARY_COLOR;
        case "new": return PRIMARY_COLOR;
        case "alert": return "red";

        case "newFloat": return PRIMARY_COLOR;
        case "backFloat": return "#959595";
        case "moreFloat": return "#0e70b8";

        default: return PRIMARY_COLOR
    };
};

export const getIconByFamily = family => {
    switch(family) {
        case "close": return <IoClose />;
        case "add": return <GoPlus />;
        case "addPerson": return <IoMdPersonAdd />;
        case "check": return <FaCheck />;
        case "dobleCheck": return <FaCheckDouble />;
        case "edit": return <BiEdit />;
        case "save": return <IoMdPersonAdd />;
        case "delete": return <BiTrash />;
        case "remove": return <MdClose />;
        case "search": return <IoMdSearch />;
        case "password": return <RiLockPasswordLine />;
        case "more": return <MdMoreVert />;
        case "new": return  <IoIosAdd />;

        case "newFloat": return  <IoIosAdd />;
        case "backFloat": return <IoIosArrowRoundBack />;
        case "moreFloat": return <IoIosMore />;


        default: return <RiAliensLine />
    };
};
