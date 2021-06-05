import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Select, Dialog, Input, Check } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import useList from '../../../hooks/useList';

const CrudPerson = {
    Basic: ({fetch, person, isOpen, close}) => {
        
        // STATE ####################################################################################################################################
        const [dialogOptions, setDialogOptions] = useState({});
            
        // LIST #####################################################################################################################################
        const phdCurrentYearList = useList("list/phd-current-year");
        const phdFinishYearList = useList("list/phd-finish-year");
        const countryList = useList("list/country");

        // CRUD VALIDATIONS #############################################################################################################################
        const schemaCrud = Yup.object().shape({
            person_name: Yup.string()
                .required('Required !')
                .min(2, "Too short!"),
            person_surname: Yup.string()
                .required('Required!')
                .min(2, "Too short!"),
            person_nickname: Yup.string()
                .required('Required!')
                .min(4, "Too short!"),
            person_email: Yup.string()
                .required('Required!')
                .lowercase()
                .email("Must be a valid email !"),
            person_mobile_number: Yup.string()
                .required('Required!'),
            country_id: Yup.string()
                .required('Required!'),
            person_is_phd_finish: Yup.boolean()
                .required('Required!'),
            phd_finish_year_id: Yup.string()
                .required('Required!'),
            phd_current_year_id: Yup.string()
                .required('Required!')
        });

        const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
            mode: 'onBlur',
            resolver: yupResolver(schemaCrud)
        });

        // EFFECT ###################################################################################################################################
        useEffect(() => {
            resetCrud(person);
        }, [person, resetCrud]);

        // CRUD #####################################################################################################################################
        const updatePerson = async data => {
            try {
                const res = await axios.post("person", {person_id: person.person_id, ...data});
                switch(res.data.result.cod) {
                    case 0:
                        fetch()
                        close();
                        break;
                    case 1:
                        setDialogOptions({family: "info", title: 'Alert', text : 'Person already exists!'})
                        break;
                    case 2:
                        setDialogOptions({family: "info", title: 'Alert', text : 'Person already exists! (nonActive)'})
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
                    <Title.Basic>{person.person_id === 0 ? 'New Person' : 'Update Person'}</Title.Basic>
                    <Input.Validation name="person_name" label="Name *" placeholder="Set your name" register={registerCrud} error={errorsCrud.person_name} />
                    <Input.Validation name="person_surname" label="Surname *" placeholder="Set your surname" register={registerCrud} error={errorsCrud.person_surname} />
                    <Input.Validation name="person_nickname" label="Nickname *" placeholder="Set your nickname" register={registerCrud} error={errorsCrud.person_nickname} />
                    <Input.Validation name="person_email" label="Email *" placeholder="example@gmail.com" register={registerCrud} error={errorsCrud.person_email} />
                    <Input.Validation name="person_mobile_number" label="Mobile number" placeholder="+569 98416398" register={registerCrud} error={errorsCrud.person_mobile_number} />
                    <Select.Validation name="country_id" label="Country *" placeholder="Select a country" register={registerCrud} content={countryList} error={errorsCrud.country_id}/>
                    <Check.Basic name="person_is_phd_finish" label="Did you finish your PhD?" register={registerCrud} error={errorsCrud.person_is_phd_finish} />
                    <Select.Validation name="phd_finish_year_id" label="In which year did you finish?" placeholder="Select a year" register={registerCrud} content={phdFinishYearList} error={errorsCrud.phd_finish_year_id}/>
                    <Select.Validation name="phd_current_year_id" label=" In which year are you?" placeholder="Select a year" register={registerCrud} content={phdCurrentYearList} error={errorsCrud.phd_current_year_id}/>
                    <Button.Basic onClick={handleSubmitCrud(updatePerson)}>Save</Button.Basic>
                </Container.Basic>
                
                {/* DIALOG ############################################################################################################################## */}
                <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
            </Modal.Form>
        );
    }
};

export default CrudPerson;