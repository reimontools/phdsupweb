import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Input, Dialog } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'

const SupervisorCrud = {
    Basic: ({fetch, supervisor, isOpen, close}) => {

        // STATE ########################################################################################################################################
        const [dialogOptions, setDialogOptions] = useState({});

        // CRUD VALIDATIONS #############################################################################################################################
        const schemaCrud = Yup.object().shape({
            supervisor_name: Yup.string()
                .required('Required!')
                .min(2, "Too short!")
                .max(100, "Too long!"),
            supervisor_surname: Yup.string()
                .required('Required!')
                .min(2, "Too short!")
                .max(100, "Too long!"),
            supervisor_orcid_web: Yup.string()
                .url("Must be a valid url!")
                .max(500, "Too long!"),
            supervisor_research_web: Yup.string()
                .url("Must be a valid url!")
                .max(500, "Too long!"),
            supervisor_academic_web: Yup.string()
                .url("Must be a valid url!")
                .max(500, "Too long!")
        });

        const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
            mode: 'onBlur',
            resolver: yupResolver(schemaCrud)
        });

        // EFFECT #######################################################################################################################################
        useEffect(() => {
            resetCrud(supervisor);
        }, [supervisor, resetCrud]);

        // CRUD #########################################################################################################################################
        const updateSupervisor = async data => {
            try {
                const res = await axios.post("supervisor", {supervisor_id: supervisor.supervisor_id, ...data});
                switch(res.data.result.cod) {
                    case 0:
                        fetch();
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
                    <Title.Basic>{supervisor.supervisor_id === 0 ? "New Supervisor University" : "Update Supervisor University"}</Title.Basic>
                    <Input.Validation name="supervisor_name" label="Name *" placeholder="Set supervisor name" register={registerCrud} error={errorsCrud.supervisor_name} />
                    <Input.Validation name="supervisor_surname" label="Surname *" placeholder="Set supervisor surname" register={registerCrud} error={errorsCrud.supervisor_surname} />
                    <Input.Validation name="supervisor_orcid_web" label="Orcid Link" placeholder="Set supervisor Orcid Link" register={registerCrud} error={errorsCrud.supervisor_orcid_web} />
                    <Input.Validation name="supervisor_research_web" label="Researchgate Website" placeholder="Set supervisor Researchgate Website" register={registerCrud} error={errorsCrud.supervisor_research_web} />
                    <Input.Validation name="supervisor_academic_web" label="Academic Google" placeholder="Set supervisor Academic Google" register={registerCrud} error={errorsCrud.supervisor_academic_web} />
                    <Button.Basic onClick={handleSubmitCrud(updateSupervisor)}>Save</Button.Basic>
                </Container.Basic>
                
                {/* DIALOG ############################################################################################################################## */}
                <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
            </Modal.Form>
        );
    }
};

export default SupervisorCrud;