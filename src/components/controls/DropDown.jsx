import styled from "styled-components";
import { PRIMARY_COLOR, MEDIUM_SCREEN_SIZE_PX, getColorByFamily, getIconByFamily } from "../../helpers/paramHelper";

const MenuStyled = styled.div `
    z-index: 10000;
    position: absolute;
    top: 50px;
    left: -160px;
    width: 150px;
    background-color: ${PRIMARY_COLOR};
    border-radius: 10px;
    transition: 200ms;
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
    div {
        display: flex;
        align-items: center; 
        justify-content: flex-start;
        color: white;
        width: 100%;
        padding: 10px 0 10px 10px;
        /* text-align: left; */
        font-size: 14px;
        &:hover {
            background-color: #773e76;
        };
    };
`;

const ContainerStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
`;

const ButtonIconStyled = styled.div `
    position: relative;
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 33px;
    height: 33px;
    border-radius: 100%;
    font-size: 23px;
    color: ${({ family }) => getColorByFamily(family)};
    transition: all 200ms ease;
    cursor: pointer;
    &:hover ${MenuStyled} {
        top: -5px;
        visibility: visible;
        opacity: 1;
    };
    &:hover {
        background-color: ${({ family }) => getColorByFamily(family)};
        color: white;
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    };
`;

const ButtonTextStyled = styled.button `
    position: relative;
    padding: 5px;
    background: ${({ family }) => getColorByFamily(family)};
    font-size: 12px;
    color: #fff;
    border: none;
    outline: none;
    border-radius: 5px;
    transition: .1s ease all;
    cursor: pointer;
    &:hover ${MenuStyled} {
        top: -9px;
        visibility: visible;
        opacity: 1;
    };
`;

const DropDown = {
    ButtonIcon: ({children, ...dropDownProps}) => {
        return ( 
            <ContainerStyled {...dropDownProps}>
                <ButtonIconStyled onClick={e => e.stopPropagation()}>
                    {getIconByFamily(dropDownProps.family)}
                    <MenuStyled>
                        {children}
                    </MenuStyled>
                </ButtonIconStyled>
            </ContainerStyled>
        );
    },
    ButtonText: ({children, ...dropDownProps}) => {
        return ( 
            <ContainerStyled {...dropDownProps}>
                <ButtonTextStyled onClick={e => e.stopPropagation()}>
                    {dropDownProps.text}
                    <MenuStyled>{children}</MenuStyled>
                </ButtonTextStyled>
                
            </ContainerStyled>
        );
    }
};

export default DropDown;