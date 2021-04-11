import styled from "styled-components";

const LoadingStyled = styled.div `
    border: 6px solid #f3f3f3;
    border-radius: 50%;
    border-top: 6px solid #ced922;
    width: 40px;
    height: 40px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    };

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    };
`;

const Loading = () => {
    return (
        <LoadingStyled />
    );
};

export default Loading;