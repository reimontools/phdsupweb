import styled from "styled-components";

const TitleBasicStyled = styled.div `
    /* position: relative; */
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 100%;
    font-size: 30px;
    font-weight: 700;
    color: #ebd6eb;
    text-align: left;
`;

const TitleBasic2Styled = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
`;

const Title = {
    Basic: ({children, ...props}) => {
        return ( 
            <TitleBasicStyled>
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