import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";
import useAppContext from "../../hooks/useAppContext";

const BurgerStyled = styled.div `
    position: absolute;
    right: 0;
    display: none;
    padding: 0;
    cursor: pointer;
    margin-right: 5%;
    z-index: 1000;
    div {
        width: 23px;
        height: 3px;
        background-color: rgb(55, 55, 55);
        margin: 3px;
        border-radius: 5px;
        transition: all .3s ease-in-out;
        &:nth-child(1) {
            transform: ${({ open }) => open ? 'translateY(6px) rotate(225deg)' : 'translateY(0) rotate(0)'};
        };
        &:nth-child(2) {
            opacity: ${({ open }) => open ? 0 : 1};
        };
        &:nth-child(3) {
            transform: ${({ open }) => open ? 'translateY(-6px) rotate(-225deg)' : 'translateY(0) rotate(0)'};
        };
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        display: block;
    };
`;

const Burger = () => {
    const { barState, setBarState } = useAppContext();
    return (
       <BurgerStyled open={ barState } onClick={() =>  setBarState(!barState)}>
            <div />
            <div />
            <div />
        </BurgerStyled>
    );
};

export default Burger;
