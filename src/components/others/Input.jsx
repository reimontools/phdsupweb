import styled from "styled-components";
import { PRIMARY_COLOR } from "../../helpers/paramHelper";

const DivInputStyled = styled.div `
    position: relative;
    padding: 10px 0;
    margin-bottom: 3px;
    input {
        padding: 12px 17px 12px 17px;
        border-radius: 3px;
        width: 100%;
        outline: none;
        border: 2px solid ${PRIMARY_COLOR};
        font-size: 15px;
    };
    .label {
        position: absolute;
        top: 10px;
        transform: translateY(-50%);
        padding: 0 5px;
        left: 8px;
        color: #222;
        background: #fff;
        /* background:linear-gradient(to top, transparent 0, transparent 38%, #fff 38%, #fff 55%, transparent 55%, transparent 100%); */
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
`;

const Input = {
    Validation: ({register, label, error, ...inputProps}) => {
        return (
            <DivInputStyled>
                <input type="text" autoComplete="off" {...inputProps} ref={register} />
                {label && <span className="label">{label}</span>}
                {error && <span className="error">{error.message}</span>}
            </DivInputStyled>
        );
    }
};

export default Input;