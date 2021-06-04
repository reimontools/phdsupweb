import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX, getIconByFamily, PRIMARY_COLOR } from "../../helpers/paramHelper";

const AvatarIconStyled = styled.div `
    display: none;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        background-color: ${({ backColor }) => backColor ? backColor : PRIMARY_COLOR};
        width: 30px;
        height: 30px;
        border-radius: 30px;
        display: flex;
        align-items: center; 
        justify-content: center;
        color: white;
        font-size: ${({ fontSize }) => fontSize ? fontSize : '18px'};
        margin-right: 5px;
    };
`;

const AvatarLetterStyled = styled.div `
    display: none;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        position: relative;
        background-color: ${({ backColor }) => backColor ? backColor : PRIMARY_COLOR};
        width: 30px;
        height: 30px;
        border-radius: 30px;
        display: flex;
        align-items: center; 
        justify-content: center;
        color: white;
        font-size: ${({ fontSize }) => fontSize ? fontSize : '18px'};
        margin-right: 10px;
    }
`;

const DeleteStyled = styled.div `
    position: absolute;
    bottom: -1px;
    right: -1px;
    background-color: grey;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center; 
    justify-content: center;
    color: white;
    font-size: 10px;
`;

const Avatar = {
    Icon: ({...avatarProps}) => {
        return ( 
            <AvatarIconStyled {...avatarProps}>
                {getIconByFamily(avatarProps.family)}
            </AvatarIconStyled>
        );
    },
    Letter: ({children, ...avatarProps}) => {
        return ( 
            <AvatarLetterStyled {...avatarProps}>
                {children}
            </AvatarLetterStyled>
        );
    },
    Delete: ({children, ...avatarProps}) => {
        return ( 
            <AvatarLetterStyled {...avatarProps}>
                <DeleteStyled>
                    {getIconByFamily("close")}
                </DeleteStyled>
                {children}
            </AvatarLetterStyled>
        );
    }
};

export default Avatar;