import { MEDIUM_SCREEN_SIZE_PX, getColorByFamily, getIconByFamily } from "../../helpers/paramHelper";
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
    top: ${({ top }) => top ? top : 'none'};
    position: ${({ right, top }) => (right || top) ? 'absolute' : 'static'};
    &:hover {
        transform: ${({ hover }) => hover ? 'scale(1.5)' : 'none'};
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    };
`;

const Icon = {
    Basic: ({action, ...props}) => {
        return (
            <DivIconStyled 
                {...props} 
                onClick={action} > 
                { getIconByFamily(props.family) }
            </DivIconStyled>
        );
    }
};

export default Icon;

