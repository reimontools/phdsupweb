import { Table, Container, Title, Modal, Avatar, DropDown, Dialog, ButtonCircle, Link, Simbol, Text, PersonUniversityCrud } from "../../../component";
import { useState } from "react";
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'

const PersonUniversityList = ({user_id, person_id, fetch, personUniversities, isOpen, close}) => {
    // STATE ########################################################################################################################################
    const [currentPersonUniversity, setCurrentPersonUniversity] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});

    // CONST ########################################################################################################################################
    const defaultPersonUniversity = {person_university_id: 0, university_id: "", person_university_is_phd_finish: false, phd_finish_year_id: "", phd_current_year_id: "", person_university_web: ""};

    // MODAL ########################################################################################################################################
    const [isOpenModalCrudPersonUniversity, openModalCrudPersonUniversity, closeModalCrudPersonUniversity] = useModal();  

    // CRUD #########################################################################################################################################
    const updatePersonUniversityIsActive = async person_university_id => {
        try {
            const res = await axios.put("person-university/" + person_university_id);
            if (!res.data.error) {
                fetch(person_id);
            };
        } catch (err) {
            console.log(err);
        };
    };

    const updatePersonUniversityState = async (id, state_id) => {
        try {
            const res = await axios.post("state/", {state_id, name: "person_university", id});
            if (res.data.result.cod === 0) return fetch(person_id);
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = personUniversity => {
        if (personUniversity.person_university_id === currentPersonUniversity.person_university_id) {
            setCurrentPersonUniversity(0);
        } else {
            setCurrentPersonUniversity(personUniversity);
        };
    };

    const handleUpdate = (e, personUniversity) => {
        e.stopPropagation();
        setCurrentPersonUniversity(personUniversity);
        openModalCrudPersonUniversity();
    };

    const handleDelete = (e, personUniversity) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this supervisor?', text: 'Are you sure you want to delete this supervisor?', action: () => updatePersonUniversityIsActive(personUniversity.person_university_id) });
    };

    const handlePersonUniversityState = (e, state_id, personUniversity) => {
        e.stopPropagation();
        if (personUniversity.state_id !== state_id) updatePersonUniversityState(personUniversity.person_university_id, state_id);
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>University</th>
                <th>PhD FInished?</th>
                <th>Any web</th>
                <th>State</th>
                <th></th>
            </tr>
        );
    };

    const renderTableRows = personUniversity => {
        var classContent = "";
        var classActions = "";

        if (personUniversity.person_university_id === currentPersonUniversity.person_university_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={personUniversity.person_university_id} onClick={() => handleExpandir(personUniversity)}>
                <td className="head">
                    {renderAvatar(personUniversity)}
                    <div className="dropdown">
                        {renderDropDown(personUniversity)}
                    </div>
                </td>
                <td className={classContent} data-label='PhD FInished?'>{personUniversity.person_university_is_phd_finish_name}</td>
                <td className={classContent} data-label='Any website'><Link.Basic href={personUniversity.person_university_web} /></td>
                <td className={classContent} data-label='State'>{renderButtonState(personUniversity)}</td>
                <td className={classActions}>{renderActions(personUniversity)}</td>
            </tr>  
        );
    };

    const renderAvatar = personUniversity => {
        return (
            <div className="avatar-container">
                <Avatar.Letter>{personUniversity.university_name[0]}</Avatar.Letter>
                <Text.Basic>{personUniversity.university_name}</Text.Basic>
            </div>
        );
    };

    const renderActions = personUniversity => {
        return (
            <div className="td-container">
               {renderDropDown(personUniversity)}
            </div>
        );
    };

    const renderDropDown = personUniversity => {
        return (
            <DropDown.ButtonIcon family="more">
                <div onClick={e => handleUpdate(e, personUniversity)}>Update</div>
                <div onClick={e => handleDelete(e, personUniversity)}>Delete</div>
            </DropDown.ButtonIcon>
        );
    };

    const renderButtonState = personUniversity => {
        return (
            <DropDown.ButtonText family="more" text={personUniversity.state_name} >
                <div onClick={e => handlePersonUniversityState(e, 1, personUniversity)}><Simbol.Point family="active"/>Active</div>
                <div onClick={e => handlePersonUniversityState(e, 2, personUniversity)}><Simbol.Point family="pending"/>Pending</div>
                <div onClick={e => handlePersonUniversityState(e, 3, personUniversity)}><Simbol.Point family="reject"/>Reject</div>
            </DropDown.ButtonText>
        );
    };

    return (
        <>
            {/* TABLE UNIVERSITY  ################################################################################################################### */}
            <Modal.Form isOpen={isOpen} closeModal={close} width="700px">
                <Container.Basic>
                    <ButtonCircle.Icon family="new" left="5px" top="5px" fontSize="17px" onClick={e => handleUpdate(e, defaultPersonUniversity)} />
                    <Title.Basic>Universities</Title.Basic>
                    {personUniversities.length === 0 
                        ?   <Container.NoRows>There is not personSupervisorUniversity.</Container.NoRows>
                        :   <Table.Basic margin="10px 0 0 0" borderBottom="none">
                                <thead>{renderTableHead()}</thead>
                                <tbody>{personUniversities.map(personUniversity => renderTableRows(personUniversity))}</tbody>
                            </Table.Basic>
                    }
                </Container.Basic>
            </Modal.Form>

            {/* CRUD UNIVERSITY  ##################################################################################################### */}
            <PersonUniversityCrud user_id={user_id} person_id={person_id} fetch={fetch} personUniversity={currentPersonUniversity} isOpen={isOpenModalCrudPersonUniversity} close={closeModalCrudPersonUniversity} /> 

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </>
    );
};

export default PersonUniversityList;