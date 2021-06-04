import { MEDIUM_SCREEN_SIZE_PX, getColorByFamily, getIconByFamily, PRIMARY_COLOR } from "../../helpers/paramHelper";
import styled from "styled-components";

const DivIconStyled = styled.div `
    cursor: pointer;
    padding: ${({ padding }) => padding ? padding : '0'};
    width: ${({ size }) => size ? size : '20px'};
    height: ${({ size }) => size ? size : '20px'};
    font-size: ${({ size }) => size ? size : '20px'};
    color: ${({ family }) => getColorByFamily(family)};
    transition: all .2s ease;
    right: ${({ right }) => right ? right : 'none'};
    left: ${({ left }) => left ? left : 'none'};
    top: ${({ top }) => top ? top : 'none'};
    position: ${({ right, top, left }) => (right || top || left) ? 'absolute' : 'static'};

    &:hover {
        transform: ${({ hover }) => hover ? 'scale(1.5)' : 'none'};
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {

        &:hover {
            transform: none;
        };
    };
`;

const NakedStyled = styled.div `
    cursor: pointer;
    padding: ${({ padding }) => padding ? padding : '0'};
    margin: ${({ margin }) => margin ? margin : '0'};
    width: ${({ size }) => size ? size : '20px'};
    height: ${({ size }) => size ? size : '20px'};
    font-size: ${({ size }) => size ? size : '18px'};
    color: ${({ color }) => color ? color : PRIMARY_COLOR};
    transition: all .2s ease;
    right: ${({ right }) => right ? right : 'none'};
    left: ${({ left }) => left ? left : 'none'};
    top: ${({ top }) => top ? top : 'none'};
    position: ${({ right, top, left }) => (right || top || left) ? 'absolute' : 'static'};

    /* &:hover {
        color: black;
    }; */

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {

        &:hover {
            transform: none;
        };
    };
`;

const Icon = {
    Basic: ({...iconProps}) => {
        return (
            <DivIconStyled {...iconProps}> 
                {getIconByFamily(iconProps.family)}
            </DivIconStyled>
        );
    },
    Naked: ({...nakedProps}) => {
        return (
            <NakedStyled {...nakedProps}> 
                {getIconByFamily(nakedProps.family)}
            </NakedStyled>
        );
    }
};

export default Icon;

