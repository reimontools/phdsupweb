import ReactDOM from "react-dom";
import styled from "styled-components";
import { Icon} from "../../component";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ModalStyled = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    width: 100vw;
    height: 100%;
    bottom: 100%;
    
    z-index: 10000;
    transition: all .5s ease-in-out;
    overflow: auto;
    
    &.open {
        bottom: 0;
    };
    
    &.form {
        background-color: rgb(0, 0, 0, .85);
    };

    .dialog {
        width: 500px;
        position: relative;
        background: #dddd;
        border-radius: 5px;
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
    ForForm: ({isOpen, closeModal, children}) => {
        return ReactDOM.createPortal(
            <ModalStyled className={isOpen && 'open form'}>
                <div className="dialog ">
                    <Icon.Basic family="close" action={closeModal} right="10px" top="10px" hover/>
                    {children}
                </div>
            </ModalStyled>, document.getElementById("root-modal")
        );
    },
    ForMessage: ({isOpen, closeModal, children}) => {
        return ReactDOM.createPortal(
            <ModalStyled className={isOpen && 'open'}>
                <div className="dialog">
                <Icon.Basic family="close" action={closeModal} right="10px" top="10px" hover/>
                    {children}
                </div>
            </ModalStyled>, document.getElementById("root-modal")
        );
    }
};

export default Modal;

