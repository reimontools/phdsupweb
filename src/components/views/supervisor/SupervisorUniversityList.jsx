import { useState } from "react";
import { Table, Container, Title, Modal, Avatar, DropDown, SupervisorUniversityCrud, Dialog, ButtonCircle, Link, Text } from "../../../component";
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'

const SupervisorUniversityList = {
    Basic: ({supervisor_id, fetch, supervisorUniversities, isOpen, close}) => {
        // STATE ########################################################################################################################################
        const [currentSupervisorUniversity, setCurrentSupervisorUniversity] = useState({});
        const [dialogOptions, setDialogOptions] = useState({});

        // CONST ########################################################################################################################################
        const defaultSupervisorUniversity = {supervisor_university_id: 0, university_id: "", supervisor_university_web: "", supervisor_university_group_web: "", supervisor_university_email: ""};

        // MODAL ########################################################################################################################################
        const [isOpenModalCrudSupervisorUniversity, openModalCrudSupervisorUniversity, closeModalCrudSupervisorUniversity] = useModal();  

        // CRUD #########################################################################################################################################
        const updateSupervisorUniversityIsActive = async supervisor_university_id => {
            try {
                const res = await axios.put("supervisor-university/" + supervisor_university_id);
                if (!res.data.error) {
                    fetch(supervisor_id);
                };
            } catch (err) {
                console.log(err);
            };
        };

        // HANDLES ######################################################################################################################################
        const handleExpandir = supervisorUniversity => {
            if (supervisorUniversity.supervisor_university_id === currentSupervisorUniversity.supervisor_university_id) {
                setCurrentSupervisorUniversity(0);
            } else {
                setCurrentSupervisorUniversity(supervisorUniversity);
            };
        };

        const handleUpdate = (e, supervisorUniversity) => {
            e.stopPropagation();
            setCurrentSupervisorUniversity(supervisorUniversity);
            openModalCrudSupervisorUniversity();
        };

        const handleDelete = (e, supervisorUniversity) => {
            e.stopPropagation();
            setDialogOptions({family: "delete", title: 'Delete this supervisorUniversity?', text: 'Are you sure you want to delete this supervisorUniversity?', action: () => updateSupervisorUniversityIsActive(supervisorUniversity.supervisor_university_id) });
        };

        // RENDERS ######################################################################################################################################
        const renderTableHead = () => {
            return (
                <tr>
                    <th>University</th>
                    <th>Personal website from University</th>
                    <th>Laboratory or group website</th>
                    <th>Institutional email</th>
                    <th></th>
                </tr>
            );
        };

        const renderTableRows = supervisorUniversity => {
            var classContent = "";
            var classActions = "";
    
            if (supervisorUniversity.supervisor_university_id === currentSupervisorUniversity.supervisor_university_id) {
                classContent = "content unhide"
                classActions = "unhide"
            } else {
                classContent = "content hide"
                classActions = "hide"
            };
    
            return (
                <tr key={supervisorUniversity.supervisor_university_id} onClick={() => handleExpandir(supervisorUniversity)}>
                    <td className="head">
                        {renderAvatar(supervisorUniversity)}
                        <div className="dropdown">
                            {renderDropDown(supervisorUniversity)}
                        </div>
                    </td>
                    <td className={classContent} data-label='Personal website from University'><Link.Basic href={supervisorUniversity.supervisor_university_web} /></td>
                    <td className={classContent} data-label='Laboratory or group website'><Link.Basic href={supervisorUniversity.supervisor_university_group_web} /></td>
                    <td className={classContent} data-label='Institutional email'>{supervisorUniversity.supervisor_university_email}</td>
                    <td className={classActions}>{renderActions(supervisorUniversity)}</td>
                </tr>  
            );
        };

        const renderActions = university => {
            return (
                <div className="td-container">
                   {renderDropDown(university)}
                </div>
            );
        };

        const renderAvatar = supervisorUniversity => {
            return (
                <div className="avatar-container">
                    <Avatar.Letter>{supervisorUniversity.university_name[0]}</Avatar.Letter>
                    <Text.Basic>{supervisorUniversity.university_name}</Text.Basic>
                </div>
            );
        };

        const renderDropDown = supervisorUniversity => {
            return (
                <DropDown.ButtonIcon family="more">
                    <div onClick={e => handleUpdate(e, supervisorUniversity)}>Update</div>
                    <div onClick={e => handleDelete(e, supervisorUniversity)}>Delete</div>
                </DropDown.ButtonIcon>
            );
        };

        // JSX ######################################################################################################################################
        return (
            <>
                {/* TABLE SUPERVISOR UNIVERSITY  #################################################################################################### */}
                <Modal.Form isOpen={isOpen} closeModal={close} width="700px">
                    <Container.Basic>
                        <ButtonCircle.Icon family="new" left="5px" top="5px" fontSize="17px" onClick={e => handleUpdate(e, defaultSupervisorUniversity)} />
                        <Title.Basic>Supervisor University</Title.Basic>
                        {supervisorUniversities.length === 0 
                            ?   <Container.NoRows>There is not supervisorUniversity.</Container.NoRows>
                            :   <Table.Basic margin="10px 0 0 0" borderBottom="none">
                                    <thead>{renderTableHead()}</thead>
                                    <tbody>{supervisorUniversities.map(supervisorUniversity => renderTableRows(supervisorUniversity))}</tbody>
                                </Table.Basic>
                        }
                    </Container.Basic>
                </Modal.Form>

                {/* CRUD SUPERVISOR UNIVERSITY  ##################################################################################################### */}
                <SupervisorUniversityCrud.Basic supervisor_id={supervisor_id} fetch={fetch} supervisorUniversity={currentSupervisorUniversity} isOpen={isOpenModalCrudSupervisorUniversity} close={closeModalCrudSupervisorUniversity} /> 

                {/* DIALOG ########################################################################################################################## */}
                <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
            </>
        );
    }
};

export default SupervisorUniversityList;