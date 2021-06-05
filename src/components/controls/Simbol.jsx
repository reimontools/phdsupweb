import styled from "styled-components";
import { getColorByFamily } from "../../helpers/paramHelper";

const StarStyled = styled.span ` 
    color: ${({ family }) => getColorByFamily(family)};
    &:before {
        content: "★";
    };
`;

const PointStyled = styled.span ` 
    color: ${({ family }) => getColorByFamily(family)};
    margin-right: 5px;
    &:before {
        content: "●";
    };
`;

const CheckStyled = styled.span ` 
    color: ${({ family }) => getColorByFamily(family)};
    &:before {
        content: "✔";
    };
`;


const Simbol = {
    Star: ({...simbolProps}) => {
        return ( 
            <StarStyled {...simbolProps}/>
        );
    },
    Point: ({...simbolProps}) => {
        return ( 
            <PointStyled {...simbolProps}/>
        );
    },
    Check: ({...simbolProps}) => {
        return ( 
            <CheckStyled {...simbolProps}/>
        );
    }
};

export default Simbol;