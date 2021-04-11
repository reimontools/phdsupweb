import styled from "styled-components";

const CheckStyled = styled.div `
    margin: 10px 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: ${({ flexJustifyContent }) => flexJustifyContent ? flexJustifyContent : 'center'};
    .toogle {
        --width: 40px;
        --height: calc(var(--width) / 2);
        --border-radius: calc(var(--height) / 2);
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
        transform: translateX(var(--height));
    };

    .toogle-fill {
        position: relative;
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background: #dddddd;
        transition: background 0.2s;
    };

    .toogle-fill::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: var(--height);
        width: var(--height);
        background: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
        border-radius: var(--border-radius);
        transition: transform 0.2s;
    };
`;

const Check = { 
    Basic: ({id, text, action, ...props}) => {
        return (
            <CheckStyled {...props}>
                <label>{text}</label>
                <label className="toogle" htmlFor={id}>
                    <input 
                        className="toogle-input" 
                        type="checkbox" 
                        id={id}
                        value={props.value}
                        onChange={e => action(e.target.checked)} />
                    <div className="toogle-fill" />
                </label>
            </CheckStyled>
        );
    }
};

export default Check;