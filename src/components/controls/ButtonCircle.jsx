import styled from "styled-components";
import { getColorByFamily, getIconByFamily } from "../../helpers/paramHelper";

const ContainerStyled = styled.div `
    position: absolute;
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 35px;
    height: 35px;
    right: ${({ right }) => right ? right : 'none'};
    left: ${({ left }) => left ? left : 'none'};
    top: ${({ top }) => top ? top : 'none'};
    bottom: ${({ bottom }) => bottom ? bottom : 'none'};
`;

const ButtonStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    background-color: ${({ family }) => getColorByFamily(family)};
    font-size: ${({ fontSize }) => fontSize ? fontSize : '15px'};
    color: white;
    box-shadow: 0px 7px 20px -10px #0000007d;
    cursor: pointer;
`;

const ButtonCircle = {
    Icon: ({children, ...buttonCircleProps}) => {
        return ( 
            <ContainerStyled {...buttonCircleProps}>
                <ButtonStyled {...buttonCircleProps}>
                    {getIconByFamily(buttonCircleProps.family)}
                </ButtonStyled>
            </ContainerStyled>
        );
    }
};

export default ButtonCircle;