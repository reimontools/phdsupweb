import styled from "styled-components";

const DivSelectStyled = styled.div `
    margin: 10px 0 10px 0;
    width: 100%;
    color: #222;
    label {
        position: absolute;
            top: -10px;
        font-weight: 600;
        padding: 3px;
        cursor: pointer; 
    };
    select {
        -webkit-appearance: none;
        width: 100%;
        background: #fff;
        border: 3px solid transparent;
        border-radius: 5px;
        height: 45px;
        padding: 0 40px 0 10px;
        transition: .3s ease all;
        border: 2px solid #663165;
        outline: none;
        &:focus {
            box-shadow: 3px 0px 30px rgba(163, 163, 163, 0.4)
        };
    };
    
    p {
        font-size: 10px;
        font-weight: 600;
        font-style: oblique;
        color: #bb3345;
        text-align: right;
        padding-top: 1px;
        padding-right: 5px;
    };
`;

const Select = {
    Validation: ({register, text, error, content, ...inputTextProps}) => {
        return (
            <DivSelectStyled>
                <select 
                    ref={register}
                    {...inputTextProps}>
                        {text && <option hidden value="">{text}</option>}
                        {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
                {error && <p>{error.message}</p>}
            </DivSelectStyled>
        );
    }
};

export default Select;