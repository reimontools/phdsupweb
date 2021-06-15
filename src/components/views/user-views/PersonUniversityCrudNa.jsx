import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Select, Dialog, Input, Check } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useList from '../../../hooks/useList';
import axios from '../../../config/axios'

const PersonUniversityCrud = ({user, fetch, personUniversity, isOpen, close}) => {
    // STATE ####################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});
    
    // LIST #########################################################################################################################################
    const universityList = useList("list/university");
    const phdCurrentYearList = useList("list/phd-current-year");
    const phdFinishYearList = useList("list/phd-finish-year");

    // CRUD VALIDATIONS #########################################################################################################################
    const schemaCrud = Yup.object().shape({
        university_id: Yup
            .string()
            .required('Required!'),
        person_university_is_phd_finish: Yup
            .boolean()
            .required('Required!'),
        phd_finish_year_id: Yup
            .string()
            .required('Required!'),
        phd_current_year_id: Yup
            .string()
            .required('Required!'),
        person_university_web: Yup
            .string()
            .required('Required!')
            .url("Must be a valid url!")
            .max(500, "Too long!"),
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // EFFECT ###################################################################################################################################
    useEffect(() => {
        resetCrud(personUniversity);
    }, [personUniversity, resetCrud]);

    // CRUD #####################################################################################################################################
    const updatePersonUniversity = async data => {
        try {
            const res = await axios.post("person-university", {person_university_id: personUniversity.person_university_id, ...user, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetch(user.person_id);
                    close();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Person-university already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Person-university already exists! (nonActive)'})
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
        <>
            <Modal.Form isOpen={isOpen} closeModal={close}>
                <Container.Basic>
                    <Title.Basic>{personUniversity.person_university_id === 0 ? 'Adding my University' : 'Update my University'}</Title.Basic>
                    <Select.Validation name="university_id" label="University" placeholder="Please select your university!" register={registerCrud} content={universityList} error={errorsCrud.university_id}/>
                    <Check.Basic name="person_university_is_phd_finish" label="Did you finish your PhD?" register={registerCrud} error={errorsCrud.person_university_is_phd_finish} />
                    <Select.Validation name="phd_finish_year_id" label="In which year did you finish?" placeholder="Select a year" register={registerCrud} content={phdFinishYearList} error={errorsCrud.phd_finish_year_id}/>
                    <Select.Validation name="phd_current_year_id" label=" In which year are you?" placeholder="Select a year" register={registerCrud} content={phdCurrentYearList} error={errorsCrud.phd_current_year_id}/>
                    <Input.Validation name="person_university_web" label="person_university_web *" placeholder="Set person_university_web" register={registerCrud} error={errorsCrud.person_university_web} />
                    <Button.Basic onClick={handleSubmitCrud(updatePersonUniversity)}>Save</Button.Basic>
                </Container.Basic>
            </Modal.Form>

            {/* DIALOG ########################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </>
    );
};

export default PersonUniversityCrud;