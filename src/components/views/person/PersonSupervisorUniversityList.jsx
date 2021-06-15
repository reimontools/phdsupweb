import { useState } from "react";
import { Table, Container, Title, Modal, Avatar, DropDown, PersonSupervisorUniversityCrud, Dialog, ButtonCircle, Text, Simbol } from "../../../component";
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'

const PersonSupervisorUniversityList = ({person_id, fetch, personSupervisorUniversities, isOpen, close}) => {
    // STATE ########################################################################################################################################
    const [currentPersonSupervisorUniversity, setCurrentPersonSupervisorUniversity] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});

    // CONST ########################################################################################################################################
    const defaultPersonSupervisor = {
        person_supervisor_university_id: 0, 
        supervisor_university_id: ""
    };

    // MODAL ########################################################################################################################################
    const [isOpenModalCrudPersonSupervisor, openModalCrudPersonSupervisor, closeModalCrudPersonSupervisor] = useModal();  

    // CRUD #########################################################################################################################################
    const updatePersonSupervisorUniversityIsActive = async person_supervisor_university_id => {
        try {
            const res = await axios.put("person-supervisor-university/" + person_supervisor_university_id);
            if (!res.data.error) {
                fetch(person_id);
            };
        } catch (err) {
            console.log(err);
        };
    };

    const updatePersonSupervisorUniversityState = async (id, state_id) => {
        try {
            const res = await axios.post("state/", {state_id, name: "person_supervisor_university", id});
            if (res.data.result.cod === 0) return fetch(person_id);
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = personSupervisorUniversity => {
        if (personSupervisorUniversity.person_supervisor_university_id === currentPersonSupervisorUniversity.person_supervisor_university_id) {
            setCurrentPersonSupervisorUniversity(0);
        } else {
            setCurrentPersonSupervisorUniversity(personSupervisorUniversity);
        };
    };

    const handleDelete = (e, personSupervisorUniversity) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this personSupervisorUniversity?', text: 'Are you sure you want to delete this personSupervisorUniversity?', action: () => updatePersonSupervisorUniversityIsActive(personSupervisorUniversity.person_supervisor_university_id) });
    };

    const handleUpdate = (e, personSupervisorUniversity) => {
        e.stopPropagation();
        setCurrentPersonSupervisorUniversity(personSupervisorUniversity);
        openModalCrudPersonSupervisor();
    };

    const handlePersonSupervisorUniversityState = (e, state_id, personSupervisorUniversity) => {
        e.stopPropagation();
        if (personSupervisorUniversity.state_id !== state_id) updatePersonSupervisorUniversityState(personSupervisorUniversity.person_supervisor_university_id, state_id);
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Supervisor</th>
                <th>University</th>
                <th>State</th>
                <th></th>
            </tr>
        );
    };

    const renderTableRows = personSupervisorUniversity => {
        var classContent = "";
        var classActions = "";

        if (personSupervisorUniversity.person_supervisor_university_id === currentPersonSupervisorUniversity.person_supervisor_university_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={personSupervisorUniversity.person_supervisor_university_id} onClick={() => handleExpandir(personSupervisorUniversity)}>
                <td className="head">
                    {renderAvatar(personSupervisorUniversity)}
                    <div className="dropdown">
                        {renderDropDown(personSupervisorUniversity)}
                    </div>
                </td>
                <td className={classContent} data-label='University'>{personSupervisorUniversity.university_name}</td>
                <td className={classContent} data-label='State'>{renderButtonState(personSupervisorUniversity)}</td>
                <td className={classActions}>{renderActions(personSupervisorUniversity)}</td>
            </tr>  
        );
    };

    const renderActions = personSupervisorUniversity => {
        return (
            <div className="td-container">
                {renderDropDown(personSupervisorUniversity)}
            </div>
        );
    };

    const renderAvatar = personSupervisorUniversity => {
        return (
            <div className="avatar-container">
                <Avatar.Letter>{personSupervisorUniversity.supervisor_fullname[0]}</Avatar.Letter>
                <Text.Basic>{personSupervisorUniversity.supervisor_fullname}</Text.Basic>
            </div>
        );
    };

    const renderDropDown = personSupervisorUniversity => {
        return (
            <DropDown.ButtonIcon family="more">
                <div onClick={e => handleUpdate(e, personSupervisorUniversity)}>Update</div>
                <div onClick={e => handleDelete(e, personSupervisorUniversity)}>Delete</div>
            </DropDown.ButtonIcon>
        );
    };

    const renderButtonState = personSupervisorUniversity => {
        return (
            <DropDown.ButtonText family="more" text={personSupervisorUniversity.state_name} >
                <div onClick={e => handlePersonSupervisorUniversityState(e, 1, personSupervisorUniversity)}><Simbol.Point family="active"/>Active</div>
                <div onClick={e => handlePersonSupervisorUniversityState(e, 2, personSupervisorUniversity)}><Simbol.Point family="pending"/>Pending</div>
                <div onClick={e => handlePersonSupervisorUniversityState(e, 3, personSupervisorUniversity)}><Simbol.Point family="reject"/>Reject</div>
            </DropDown.ButtonText>
        );
    };

    // JSX ######################################################################################################################################
    return (
        <>
            {/* TABLE SUPERVISOR UNIVERSITY  #################################################################################################### */}
            <Modal.Form isOpen={isOpen} closeModal={close} width="700px">
                <Container.Basic>
                    <ButtonCircle.Icon family="new" left="5px" top="5px" fontSize="17px" onClick={e => handleUpdate(e, defaultPersonSupervisor)} />
                    <Title.Basic>Supervisors</Title.Basic>
                    {personSupervisorUniversities.length === 0 
                        ?   <Container.NoRows>There is not personSupervisorUniversity.</Container.NoRows>
                        :   <Table.Basic margin="10px 0 0 0" borderBottom="none">
                                <thead>{renderTableHead()}</thead>
                                <tbody>{personSupervisorUniversities.map(personSupervisorUniversity => renderTableRows(personSupervisorUniversity))}</tbody>
                            </Table.Basic>
                    }
                </Container.Basic>
            </Modal.Form>

            {/* CRUD SUPERVISOR UNIVERSITY  ##################################################################################################### */}
            <PersonSupervisorUniversityCrud person_id={person_id} fetch={fetch} personSupervisorUniversity={currentPersonSupervisorUniversity} isOpen={isOpenModalCrudPersonSupervisor} close={closeModalCrudPersonSupervisor} /> 

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </>
    );
}

export default PersonSupervisorUniversityList