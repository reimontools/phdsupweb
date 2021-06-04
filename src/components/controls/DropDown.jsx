import styled from "styled-components";
import { PRIMARY_COLOR, MEDIUM_SCREEN_SIZE_PX, getColorByFamily, getIconByFamily } from "../../helpers/paramHelper";

const MenuStyled = styled.div `
    z-index: 10000;
    position: absolute;
    top: 5px;
    right: 43px;
    width: 150px;
    background-color: ${PRIMARY_COLOR};
    border-radius: 10px;
    transition: 0.5s;
    visibility: hidden;
    opacity: 0;
    padding:5px;
    cursor: pointer;
    &:before {
        z-index: -1;
        content: '';
        position: absolute;
        top: 14px;
        right: -4px;
        width: 15px;
        height: 15px;
        background: ${PRIMARY_COLOR};
        transform: rotate(45deg);
    };
    /* @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        right: 43px;
    }; */
`;

const ContainerStyled = styled.div `
    position: relative;
    display: flex;
    align-items: center; 
    justify-content: center;
    /* transition: all 300ms ease; */
    &:hover ${MenuStyled} {
        top: -5px;
        visibility: visible;
        opacity: 1;
    };
    .menu-content {
        color: white;
        width: 100%;
        padding: 10px 0 10px 10px;
        text-align: left;
        &:hover {
            background-color: #773e76;
        };
    };
`;

const ButtonStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 33px;
    height: 33px;
    border-radius: 100%;
    /* background-color: white; */
    font-size: 23px;
    color: ${({ family }) => getColorByFamily(family)};
    transition: all 300ms ease;
    cursor: pointer;
    &:hover {
        background-color: ${({ family }) => getColorByFamily(family)};
        color: white;
        /* transform: scale(1.1); */
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    };
`;

const DropDown = {
    Basic: ({children, ...dropDownProps}) => {
        return ( 
            <ContainerStyled {...dropDownProps}>
                <ButtonStyled onClick={e => e.stopPropagation()}>
                    {getIconByFamily(dropDownProps.family)}
                </ButtonStyled>
                <MenuStyled>{children}</MenuStyled>
            </ContainerStyled>
        );
    }
};

export default DropDown;