import { ROUTES } from "../../helpers/routeHelper";
import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";
import useAppContext from "../../hooks/useAppContext.js";

export const NavStyled = styled.nav `
    position: relative;
    bottom: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center; 
    justify-content: center;
    .navlink {
        font-size: 30px;
        color: #f8f1f8;
        text-decoration: none;
        padding-left: 20px;
        &:hover {
            color: #ced922;
        };
        &.active {
            color: #ced922;
        };
    };
    .right {
        position: absolute;
        right: 0;
        padding-right: 1%;
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        width: 100vw;
        height: 100vh;
        background-color: #663165;
        flex-direction: column;
        align-items: center; 
        justify-content: space-evenly;
        position: fixed;
        bottom: ${({ open }) => open ? '0' : '100%'};
        left: 0;
        transition: all .5s ease-in-out;
        .right {
            position: relative;
            padding-right: 0;
        };
    };
`;

const NavBar = () => {
    const { barState, setBarState, user, logOut, isLogged } = useAppContext();
    return (
        <>
            <NavStyled open={ barState }>
                {ROUTES.map((item, key) => {
                    if(item.showInBar) {
                        if (item.auth === "all") return <NavLink className="navlink" key={key} onClick={() => setBarState(false)} to={item.path} activeClassName="active" exact>{item.title}</NavLink>;
                        if (item.auth === "nonAuth" && !isLogged()) return <NavLink className="navlink" key={key} onClick={() => setBarState(false)} to={item.path} activeClassName="active" exact>{item.title}</NavLink>;
                        if (item.auth === "auth" && isLogged()) {
                            if (item.allowTo.includes(user.rol) || item.allowTo.includes('*')) { 
                                return <NavLink className="navlink" key={key} onClick={() => setBarState(false)} to={item.path} activeClassName="active" exact>{item.title}</NavLink>;
                            };
                        };
                    };
                    return null;
                })}
                {isLogged() && <Link className="navlink right" onClick={() => logOut()} to="/" >Exit</Link>}
            </NavStyled>
        </>
    );
};

export default NavBar;
