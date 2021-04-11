import { MEDIUM_SCREEN_SIZE_PX, getColorByFamily } from "../../helpers/paramHelper";
import styled from "styled-components";

const DivButtonStyled = styled.button `
    cursor: pointer;
    margin: ${({ margin }) => margin ? margin : '0'};
    padding: 5px;
    height: ${({ height }) => height ? height : '45px'};
    background: ${({ family }) => getColorByFamily(family)};
    width: ${({ fit }) => fit ? 'auto' : '100%'};
    font-size: ${({ size }) => size ? size : '16px'};
    color: #fff;
    /* font-weight: 600; */
    font-weight: ${({ weight }) => weight ? weight : '600'};
    border: none;
    outline: none;
    border-radius: 5px;
    transition: .1s ease all;
    &:hover {
        /* box-shadow: 3px 0px 30px rgba(163, 163, 163, 1); */
        transform: ${({ hover }) => hover ? 'scale(1.5)' : 'none'};
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    };
`;

const Button = {
    Basic: ({action, ...props}) => {
        return (
            <DivButtonStyled 
                type='button'
                {...props}
                onClick={action}
            />
        );
    }
};

export default Button;

