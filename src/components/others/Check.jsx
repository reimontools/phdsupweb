import styled from "styled-components";

const CheckStyled = styled.div `
    margin: 10px 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: ${({ flexJustifyContent }) => flexJustifyContent ? flexJustifyContent : 'space-between'};
    .toogle {
        display: inline-block;
        cursor: pointer;
    };

    .toogle-input {
        display: none;
    };

    .toogle-input:checked ~ .toogle-fill {
        background: #663165;
    };

    .toogle-input:checked ~ .toogle-fill::after {
        transform: translateX(20px);
    };

    .toogle-fill {
        position: relative;
        width: 40px;
        height: 20px;
        border-radius: 10px;
        background: #dddddd;
        transition: background 0.2s;
    };

    .toogle-fill::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        height: 16px;
        width: 16px;
        background: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        transition: transform 0.2s;
    };
`;

const Check = { 
    Basic: ({text, action, ...props}) => {
        return (
            <CheckStyled {...props}>
                <label>{text}</label>
                <label className="toogle" >
                    <input 
                        className="toogle-input" 
                        type="checkbox" 
                        value={props.value}
                        onChange={e => action(e.target.checked)} />
                    <div className="toogle-fill" />
                </label>
            </CheckStyled>
        );
    }
};

export default Check;