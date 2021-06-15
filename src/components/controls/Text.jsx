import styled from "styled-components";
import { formatLengthText } from "../../helpers/paramHelper";

const TextStyled = styled.div `
`;

const Text = {
    Basic: ({children, ...textProps}) => {
        return ( 
            <TextStyled {...textProps}>
                {formatLengthText(children)}
            </TextStyled>
        );
    }
};

export default Text;