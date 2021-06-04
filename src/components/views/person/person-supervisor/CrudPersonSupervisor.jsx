import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Select, Dialog } from "../../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../../config/axios'
import useList from '../../../../hooks/useList';

const CrudPersonSupervisor = {
    Basic: ({person_id, fetch, personSupervisor, isOpen, close}) => {

        // STATE ########################################################################################################################################
        const [dialogOptions, setDialogOptions] = useState({});
            
        // LIST #########################################################################################################################################
        const universityList = useList("list/university");
        const supervisorList = useList("list/supervisor");

        // CRUD VALIDATIONS #############################################################################################################################
        const schemaCrud = Yup.object().shape({
            university_id: Yup.string()
                .required('Required!'),
            supervisor_id: Yup.string()
                .required('Required!')
        });

        const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
            mode: 'onBlur',
            resolver: yupResolver(schemaCrud)
        });

        // EFFECT #######################################################################################################################################
        useEffect(() => {
            resetCrud(personSupervisor);
        }, [personSupervisor, resetCrud]);

        // CRUD #########################################################################################################################################
        const updatePersonSupervisor = async data => {
            try {
                const res = await axios.post("person-supervisor", {person_supervisor_id: personSupervisor.person_supervisor_id, person_id, ...data});
                switch(res.data.result.cod) {
                    case 0:
                        fetch(person_id);
                        close();
                        break;
                    case 1:
                        setDialogOptions({family: "info", title: 'Alert', text : 'Person-supervisor already exists!'})
                        break;
                    case 2:
                        setDialogOptions({family: "info", title: 'Alert', text : 'Person-supervisor already exists! (nonActive)'})
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
                    <Title.Basic>{personSupervisor.person_supervisor_id === 0 ? "New Supervisor University" : "Update Supervisor University"}</Title.Basic>
                    <Select.Validation name="university_id" label="University" placeholder="Select a university" register={registerCrud} content={universityList} error={errorsCrud.university_id}/>
                    <Select.Validation name="supervisor_id" label="Supervisor" placeholder="Select a supervisor" register={registerCrud} content={supervisorList} error={errorsCrud.supervisor_id}/>
                    <Button.Basic onClick={handleSubmitCrud(updatePersonSupervisor)}>Save</Button.Basic>
                </Container.Basic>
                
                {/* DIALOG ############################################################################################################################## */}
                <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
            </Modal.Form>
        );
    }
};

export default CrudPersonSupervisor;