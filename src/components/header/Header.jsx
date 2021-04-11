import styled from "styled-components";
import { NavBar, Logo, Burger } from "../../component";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

export const HeaderStyled = styled.div `
    position: fixed;
    width: 100%;
    height: 10%;
    top: 0;
    background-color: #663165;
    display: flex;
    align-items: center; 
    z-index: 500;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        justify-content: space-between;
    };
`;

const Header = () => {
    return (
       <HeaderStyled>
           <Logo />
           <Burger />
           <NavBar />
        </HeaderStyled>
    );
};

export default Header;
