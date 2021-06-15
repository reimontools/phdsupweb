import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Dialog, Input } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import { LOWERCASEREGEX, UPPERCASEREGEX, NUMERICREGEX } from "../../../helpers/paramHelper";

const ConcreCrud = {
    Basic: ({person, isOpen, close}) => {
        
        // STATE ####################################################################################################################################
        const [dialogOptions, setDialogOptions] = useState({});

        // PASSWORD VALIDATIONS #####################################################################################################################
        const schemaCrud = Yup.object().shape({
            concre: Yup.string()
                .required('Required!')
                .min(8, "Minimun 8 characters required!")
                .matches(NUMERICREGEX, 'One number required!')
                .matches(LOWERCASEREGEX, 'One lowercase required!')
                .matches(UPPERCASEREGEX, 'One uppercase required!'),
            concreConfirm: Yup.string()
                .required('Required!')
                .oneOf([Yup.ref('concre')], 'Password must be the same!')
        });

        const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
            mode: 'onBlur',
            resolver: yupResolver(schemaCrud)
        });

        // CRUD #####################################################################################################################################
        const updateUserConcre = async data => {
            try {
                const res = await axios.post("user/concre", {user_id: person.user_id, ...data});
                if (res.data.result.cod === 0) {
                    handleCloseConcre()
                } else {
                    setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
                };
            } catch(err) {
                console.log('Err: ' + err);
            };
        };

        // HANDLES ######################################################################################################################################
        const handleCloseConcre = () => {
            resetCrud({concre: "", concreConfirm: ""});
            close()
        };

        // JSX ######################################################################################################################################
        return (
            <Modal.Form isOpen={isOpen} closeModal={handleCloseConcre}>
                <Container.Basic>
                    <Title.Basic>Update concre</Title.Basic>
                    <Input.Validation name="concre" label="Password *" type="password" register={registerCrud} error={errorsCrud.concre} />
                    <Input.Validation name="concreConfirm" label="Confirm password *" type="password" register={registerCrud} error={errorsCrud.concreConfirm} />
                    <Button.Basic onClick={handleSubmitCrud(updateUserConcre)}>Save</Button.Basic>
                </Container.Basic>
                
                {/* DIALOG ############################################################################################################################## */}
                <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
            </Modal.Form>
        );
    }
};

export default ConcreCrud;