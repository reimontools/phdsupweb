import styled from "styled-components";
import { PRIMARY_COLOR } from "../../helpers/paramHelper";

const DivSelectStyled = styled.div `
    position: relative;
    padding: 10px 0;
    margin-bottom: 3px;
    select {
        -webkit-appearance: none;
        cursor: pointer;
        padding: 12px 17px 12px 17px;
        border-radius: 3px;
        width: 100%;
        height: 46px;
        outline: none;
        border: 2px solid ${PRIMARY_COLOR};
        font-size: 15px;
        &:not(:valid) {
            color: #757575;
        };
    };
    option { 
        color: #222;
    };
    .label {
        position: absolute;
        top: 10px;
        transform: translateY(-50%);
        padding: 0 5px;
        left: 8px;
        color: #222;
        background: #fff;
        background-size: 1px;
        font-size: 13px;
    };
    .error {
        position: absolute;
        bottom: 3px;
        transform: translateY(50%);
        right: 8px;
        font-size: 12px;
        font-weight: 600;
        color: #bb3345;
    };
    .arrow {
        pointer-events: none;
        position: absolute;
        top: calc(50%);
        transform: translateY(-50%);
        right: 17px;
        font-size: 15px;
        font-weight: 600;
        color: ${PRIMARY_COLOR};
    };
`;

const Select = {
    Validation: ({register, label, error, placeholder, content, ...selectProps}) => {
        return (
            <DivSelectStyled {...selectProps}>
                <select 
                    required
                    ref={register}
                    name={selectProps.name}>
                        {placeholder && <option value="" hidden>{placeholder}</option>}
                        {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
                <label className="arrow">{"▼"}</label>
                {label && <span className="label">{label}</span>}
                {error && <span className="error">{error.message}</span>}
            </DivSelectStyled>
        );
    }
};

export default Select;