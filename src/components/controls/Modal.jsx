import ReactDOM from "react-dom";
import styled from "styled-components";
import { ButtonCircle } from "../../component";
import { MEDIUM_SCREEN_SIZE_PX, SECONDARY_COLOR } from "../../helpers/paramHelper";

const DivModalStyled = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    width: 100vw;
    height: 100%;
    bottom: 100%;
    
    /* z-index: 10000; */

    z-index: ${({ zindex }) => zindex ? zindex : 10000};

    transition: all .5s ease-in-out;
    overflow: auto;
    
    &.open {
        bottom: 0;
    };
    
    &.form {
        background-color: rgb(0, 0, 0, .85);
    };

    .dialog {
        width: 700px;
        width: ${({ width }) => width ? width : "500px"};
        position: relative;
        background: ${SECONDARY_COLOR};
        border-radius: 10px;
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        align-items: flex-start;
        padding-top: 60px;
        .dialog {
            width: 90%;
            height: auto;
        };
    };
`;

const Modal = {
    Form: ({isOpen, closeModal, children, ...modalProps}) => {
        return ReactDOM.createPortal(
            <DivModalStyled className={isOpen && 'open form'} {...modalProps}>
                <div className="dialog ">
                    <ButtonCircle.Icon family="close" onClick={closeModal} right="5px" top="5px" />
                    {children}
                </div>
            </DivModalStyled>, document.getElementById("root-modal")
        );
    }
};

export default Modal;

