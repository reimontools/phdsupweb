import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Select, Dialog } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import useList from '../../../hooks/useList';

const PersonSupervisorUniversityCrud = ({person_id, fetch, personSupervisorUniversity, isOpen, close}) => {
    // STATE ####################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});
        
    // LIST #####################################################################################################################################
    const supervisorUniversityList = useList("list/supervisor-university");

    // CRUD VALIDATIONS #########################################################################################################################
    const schemaCrud = Yup.object().shape({
        supervisor_university_id: Yup.string()
            .required('Required!')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // EFFECT ###################################################################################################################################
    useEffect(() => {
        resetCrud(personSupervisorUniversity);
    }, [personSupervisorUniversity, resetCrud]);

    // CRUD #####################################################################################################################################
    const pupdatePersonSupervisorUniversity = async data => {
        console.log("asdasda", {person_supervisor_university_id: personSupervisorUniversity.person_supervisor_university_id, person_id, ...data});
        try {
            const res = await axios.post("person-supervisor-university", {person_supervisor_university_id: personSupervisorUniversity.person_supervisor_university_id, person_id, ...data});
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

    // JSX ######################################################################################################################################
    return (
        <Modal.Form isOpen={isOpen} closeModal={close}>
            <Container.Basic>
                <Title.Basic>{personSupervisorUniversity.person_supervisor_university_id === 0 ? "New Supervisor" : "Update Supervisor"}</Title.Basic>
                <Select.Validation name="supervisor_university_id" label="Supervisor University" placeholder="Select a supervisor university" register={registerCrud} content={supervisorUniversityList} error={errorsCrud.supervisor_university_id}/>
                <Button.Basic onClick={handleSubmitCrud(pupdatePersonSupervisorUniversity)}>Save</Button.Basic>
            </Container.Basic>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </Modal.Form>
    );
};

export default PersonSupervisorUniversityCrud;