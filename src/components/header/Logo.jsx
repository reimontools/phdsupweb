import styled from "styled-components";
import logo from '../../assets/images/logo_v1.png';
import { useHistory } from 'react-router-dom'
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";
import useAppContext from "../../hooks/useAppContext";

export const LogoStyled = styled.div `
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center; 
    justify-content: center;
    z-index: 1000;
    padding-left: 1%;
    img {
        height: 80%;
        cursor: pointer;
    }
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        margin-left: 5%;
    };
`;

const Logo = () => {
    const { setBarState } = useAppContext();
    const history = useHistory();
    const goHome = () => {
        history.push('/');
        setBarState(false);
    }
    return (
       <LogoStyled>
            <img src={logo} alt='wenashh'onClick={() => goHome()}/>
        </LogoStyled>
    );
};

export default Logo;
