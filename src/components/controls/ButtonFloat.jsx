import styled from "styled-components";
import {  getIconByFamily, getColorByFamily, MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ContainerStyled = styled.div `
    position: fixed;
    display: flex;
    align-items: center; 
    justify-content: center;
    bottom: ${({ bottom }) => bottom ? bottom : '10px'};
    right: 1px;
    width: 60px;
    height: 60px;
`;

const ButtonStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background-color: ${({ family }) => getColorByFamily(family)};
    font-size: 25px;
    color: white;
    transition: all 300ms ease;
    box-shadow: 0px 7px 20px -10px #0000007d;
    cursor: pointer;
    &:hover {
        transform: ${({ hover }) => hover ? 'scale(1.2)' : 'none'};
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    };
`;

const ButtonFloat =  {
    Icon: ({...buttonFloatProps}) => {
        return (
            <ContainerStyled {...buttonFloatProps}>
                <ButtonStyled {...buttonFloatProps}>
                    {getIconByFamily(buttonFloatProps.family)}
                </ButtonStyled>
            </ContainerStyled>
        );
    }
};

export default ButtonFloat;
