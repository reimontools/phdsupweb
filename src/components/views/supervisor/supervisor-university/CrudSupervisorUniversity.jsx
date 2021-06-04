import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Input, Select, Dialog } from "../../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../../config/axios'
import useList from '../../../../hooks/useList';

const CrudSupervisorUniversity = {
    Basic: ({supervisor_id, fetch, supervisorUniversity, isOpen, close}) => {

        // STATE ########################################################################################################################################
        const [dialogOptions, setDialogOptions] = useState({});
            
        // LIST #########################################################################################################################################
        const universityList = useList("list/university");

        // CRUD VALIDATIONS #############################################################################################################################
        const schemaCrud = Yup.object().shape({
            university_id: Yup.string()
                .required('Required!'),
            supervisor_university_web: Yup.string()
                .required('Required!')
                .min(10, "Too short!")
                .max(100, "Too long!"),
            supervisor_university_group_web: Yup.string()
                .url("Must be a valid url!")
                .max(500, "Too long!"),
            supervisor_university_email: Yup.string()
                .lowercase()
                .email("Must be a valid email!")
                .max(50, "Too long!")
        });

        const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
            mode: 'onBlur',
            resolver: yupResolver(schemaCrud)
        });

        // EFFECT #######################################################################################################################################
        useEffect(() => {
            resetCrud(supervisorUniversity);
        }, [supervisorUniversity, resetCrud]);

        // CRUD #########################################################################################################################################
        const updateSupervisorUniversity = async data => {
            try {
                const res = await axios.post("supervisor-university", {supervisor_id, supervisor_university_id: supervisorUniversity.supervisor_university_id, ...data});
                switch(res.data.result.cod) {
                    case 0:
                        fetch(supervisor_id);
                        close();
                        break;
                    case 1:
                        setDialogOptions({family: "info", title: 'Alert', text : 'Supervisor already exists!'})
                        break;
                    case 2:
                        setDialogOptions({family: "info", title: 'Alert', text : 'Supervisor already exists! (nonActive)'})
                        break;
                    default:
                        setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                        break;
                };
            } catch(err) {
                console.log('Err: ' + err);
            };
        };

        // JSX ##########################################################################################################################################
        return (
            <Modal.Form isOpen={isOpen} closeModal={close}>
                <Container.Basic>
                    <Title.Basic>{supervisorUniversity.supervisor_university_id === 0 ? "New Supervisor University" : "Update Supervisor University"}</Title.Basic>
                    <Select.Validation name="university_id" label="University" placeholder="Select a university" register={registerCrud} content={universityList} error={errorsCrud.university_id}/>
                    <Input.Validation name="supervisor_university_web" label="Personal website from University *" placeholder="Set personal website from University" register={registerCrud} error={errorsCrud.supervisor_university_web} />
                    <Input.Validation name="supervisor_university_group_web" label="Laboratory or group website" placeholder="Set laboratory or group website" register={registerCrud} error={errorsCrud.supervisor_university_group_web} />
                    <Input.Validation name="supervisor_university_email" label="Institutional email" placeholder="Set institutional email" register={registerCrud} error={errorsCrud.supervisor_university_email} />
                    <Button.Basic onClick={handleSubmitCrud(updateSupervisorUniversity)}>Save</Button.Basic>
                </Container.Basic>
                
                {/* DIALOG ############################################################################################################################## */}
                <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
            </Modal.Form>
        );
    }
};

export default CrudSupervisorUniversity;