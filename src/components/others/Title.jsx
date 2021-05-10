import styled from "styled-components";
import { PRIMARY_COLOR } from "../../helpers/paramHelper";

const TitleBasicStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 100%;
    font-size: ${({ fontSize }) => fontSize ? fontSize : "20px"};
    font-weight: 700;
    color: ${({ color }) => color ? color : PRIMARY_COLOR};
    padding-bottom: 5px;
`;

const TitlePrimaryStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 100%;
    font-size: ${({ fontSize }) => fontSize ? fontSize : "25px"};
    font-weight: 700;
    color: ${({ color }) => color ? color : PRIMARY_COLOR};
    padding: 10px;
`;

const TitleBasic2Styled = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
`;

const Title = {
    Primary: ({children, ...titleProps}) => {
        return ( 
            <TitlePrimaryStyled {...titleProps}>
                {children}
            </TitlePrimaryStyled>
        );
    },
    Basic: ({children, ...titleProps}) => {
        return ( 
            <TitleBasicStyled {...titleProps}>
                {children}
            </TitleBasicStyled>
        );
    },
    Basic2: ({children, ...props}) => {
        return ( 
            <TitleBasic2Styled>
                {children}
            </TitleBasic2Styled>
        );
    }
};

export default Title;