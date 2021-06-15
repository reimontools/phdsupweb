import styled from "styled-components";
import { PRIMARY_COLOR, formatLengthLink } from "../../helpers/paramHelper";

const LinkStyled = styled.a `
   text-decoration: none;
   display: inline-block;
   color: black;
   &:after {
        content: '';
        display: block;
        width: 0;
        height: 2px;
        background: ${PRIMARY_COLOR};
        transition: width .3s;
    };
    &:hover:after {
        width: 100%;
        transition: width .3s;
    };
`;

const Link = {
    Basic: ({...linkProps}) => {
        return ( 
            <LinkStyled {...linkProps} target="_blank" onClick={e => e.stopPropagation()}>
                {formatLengthLink(linkProps.href)}
            </LinkStyled>
        );
    }
};

export default Link;