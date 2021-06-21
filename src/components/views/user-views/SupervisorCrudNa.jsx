import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Input, Dialog, Select } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import { getCapitalInSentence } from "../../../helpers/paramHelper";

const SupervisorCrudNa = ({person_id, personUniversityList, fetch, isOpen, close}) => {
    // STATE ########################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD VALIDATIONS #############################################################################################################################
    const schemaCrud = Yup.object().shape({
        supervisor_name: Yup
            .string()
            .required('Required!')
            .trim()
            .min(2, "Too short!")
            .max(50, "Too long!")
            .transform(value => getCapitalInSentence(value)),
        supervisor_surname: Yup
            .string()
            .required('Required!')
            .trim()
            .min(2, "Too short!")
            .max(50, "Too long!")
            .transform(value => getCapitalInSentence(value)),
        supervisor_orcid_web: Yup
            .string()
            .required('Required!')
            .url("Must be a valid url!")
            .max(500, "Too long!"),
        supervisor_research_web: Yup
            .string()
            .url("Must be a valid url!")
            .max(500, "Too long!"),
        supervisor_academic_web: Yup
            .string()
            .url("Must be a valid url!")
            .max(500, "Too long!"),
        university_id: Yup
            .string()
            .required('Required!'),
        supervisor_university_web: Yup
            .string()
            .required('Required!')
            .url("Must be a valid url!")
            .max(500, "Too long!"),
        supervisor_university_group_web: Yup
            .string()
            .url("Must be a valid url!")
            .max(500, "Too long!"),
        supervisor_university_email: Yup
            .string()
            .lowercase()
            .email("Must be a valid email!")
            .max(100, "Too long!")
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // CRUD #########################################################################################################################################
    const updateSupervisor = async data => {
        try {
            const res = await axios.post("supervisor-na", {...data});
            console.log("res", res);
            switch(res.data.result.cod) {
                case 0:
                    fetch(person_id);
                    handleClose();
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

    // HANDLES ######################################################################################################################################
    const handleClose = () => {
        resetCrud({supervisor_name: "", supervisor_surname: "", supervisor_orcid_web: "", supervisor_research_web: "", supervisor_academic_web: "", university_id: "", supervisor_university_web: "", supervisor_university_group_web: "", supervisor_university_email: ""});
        close()
    };

    // JSX ##########################################################################################################################################
    return (
        <Modal.Form isOpen={isOpen} closeModal={handleClose}>
            <Container.Basic>
                <Title.Basic>Add a Supervisor</Title.Basic>
                <Input.Validation name="supervisor_name" label="Name *" placeholder="Set supervisor name" register={registerCrud} error={errorsCrud.supervisor_name} />
                <Input.Validation name="supervisor_surname" label="Surname *" placeholder="Set supervisor surname" register={registerCrud} error={errorsCrud.supervisor_surname} />
                <Input.Validation name="supervisor_orcid_web" label="Orcid Link *" placeholder="https://orcid.org/0000-0001-2345-6789" register={registerCrud} error={errorsCrud.supervisor_orcid_web} />
                <Input.Validation name="supervisor_research_web" label="Researchgate Website" placeholder="Set supervisor Researchgate Website" register={registerCrud} error={errorsCrud.supervisor_research_web} />
                <Input.Validation name="supervisor_academic_web" label="Academic Google" placeholder="Set supervisor Academic Google" register={registerCrud} error={errorsCrud.supervisor_academic_web} />
                <Select.Validation name="university_id" label="University" placeholder="Select a university" register={registerCrud} content={personUniversityList} error={errorsCrud.university_id}/>
                <Input.Validation name="supervisor_university_web" label="Personal website from University *" placeholder="Set personal website from University" register={registerCrud} error={errorsCrud.supervisor_university_web} />
                <Input.Validation name="supervisor_university_group_web" label="Laboratory or group website" placeholder="Set laboratory or group website" register={registerCrud} error={errorsCrud.supervisor_university_group_web} />
                <Input.Validation name="supervisor_university_email" label="Institutional email" placeholder="Set institutional email" register={registerCrud} error={errorsCrud.supervisor_university_email} />
                <Button.Basic onClick={handleSubmitCrud(updateSupervisor)}>Save</Button.Basic>
            </Container.Basic>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Modal.Form>
    );
}


export default SupervisorCrudNa;