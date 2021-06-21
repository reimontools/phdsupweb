import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Modal, Title, Button, Select, Dialog, ButtonCircle, SupervisorCrudNa, Input } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";

const PersonSupervisorUniversityCrud = ({person_id, fetch, personSupervisorUniversity, isOpen, close}) => {
    // STATE ####################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});
    const [personUniversityList, setPersonUniversityList] = useState([]);
    const [supervisorUniversities, setSupervisorUniversities] = useState([]);

    // MODAL ####################################################################################################################################
    const [isOpenModalSupervisorCrudNa, openModalSupervisorCrudNa, closeModalSupervisorCrudNa] = useModal();

    // FETCHS ###################################################################################################################################
    const fetchPersonUniversitiesByPersonId = async person_id => {
        const personUniversityList = await getList("person-university/" + person_id);
        setPersonUniversityList(personUniversityList);
    };

    const fetchSupervisorUniversitiesByPersonId = async person_id => {
        const supervisorUniversities = await getList("supervisor-university/person/" + person_id);
        setSupervisorUniversities(supervisorUniversities);
    };

    // CRUD VALIDATIONS #########################################################################################################################
    const schemaCrud = Yup.object().shape({
        university_id: Yup.string()
            .required('Required!'),
        supervisor_id: Yup.string()
            .required('Required!')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud, watch: watchCrud} = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // FILTER #######################################################################################################################################
    const watch_university_id = watchCrud("university_id");
    const supervisorUniversityList = supervisorUniversities.filter(filByUniversity);
    function filByUniversity(supervisor) { 
        if (!watch_university_id) return null;
        if (supervisor.university_id === parseInt(watch_university_id)) {
            return supervisor;
        };
        return null;
    };

    // EFFECT ###################################################################################################################################
    useEffect(() => {
        fetchPersonUniversitiesByPersonId(person_id);
        fetchSupervisorUniversitiesByPersonId(person_id);
    }, [person_id]);

    // REVISAR ESTO!!!!!
    useEffect(() => {
        resetCrud(personSupervisorUniversity);
    }, [personSupervisorUniversity, resetCrud]);

    // CRUD #####################################################################################################################################
    const updatePersonSupervisorUniversity = async data => {
        console.log("data", {person_supervisor_university_id: personSupervisorUniversity.person_supervisor_university_id, person_id, ...data});
        try {
            const res = await axios.post("person-supervisor-university", {person_supervisor_university_id: personSupervisorUniversity.person_supervisor_university_id, person_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetch(person_id);
                    close();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Person-supervisor-university already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Person-supervisor-university already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLES ##################################################################################################################################
    const handleUpdate = e => {
        e.stopPropagation();
        openModalSupervisorCrudNa();
    };

    const handleCloseModalSupervisorCrudNa = () => {
        closeModalSupervisorCrudNa();
        resetCrud({supervisor_id: "", university_id: ""});
    };

    // JSX ######################################################################################################################################
    return (
        <>
            <Modal.Form isOpen={isOpen} closeModal={close}>
                <Container.Basic>
                    <Title.Basic>Supervisors</Title.Basic>
                    <ButtonCircle.Icon family="new" left="5px" top="5px" fontSize="17px" onClick={e => handleUpdate(e)} />
                    <Select.Validation name="university_id" label="University" placeholder="Please select your university" register={registerCrud} content={personUniversityList} error={errorsCrud.university_id}/>
                    <Select.Validation name="supervisor_id" label="Supervisor" placeholder="Please select your supervisor" register={registerCrud} content={supervisorUniversityList} error={errorsCrud.supervisor_id}/>
                    <Input.Validation name="keywords" label="Keywords" placeholder="Mention at least 3" register={registerCrud} error={errorsCrud.keywords} />
                    <Button.Basic onClick={handleSubmitCrud(updatePersonSupervisorUniversity)}>Save</Button.Basic>
                </Container.Basic>
            </Modal.Form>

            {/* DIALOG ########################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />

            {/* CRUD SUPERVISOR NA ############ ################################################################################################# */}
            <SupervisorCrudNa person_id={person_id} personUniversityList={personUniversityList} fetch={fetchSupervisorUniversitiesByPersonId} isOpen={isOpenModalSupervisorCrudNa} close={handleCloseModalSupervisorCrudNa} /> 
        </>
    );
};

export default PersonSupervisorUniversityCrud;