import { useState } from "react";
import { Table, Container, Title, Modal, Avatar, DropDown, CrudPersonSupervisor, Dialog, ButtonCircle } from "../../../../component";
import useModal from "../../../../hooks/useModal";
import axios from '../../../../config/axios'

const ListPersonSupervisor = {
    Basic: ({person_id, fetch, personSupervisors, isOpen, close}) => {
        // STATE ########################################################################################################################################
        const [currentPersonSupervisor, setCurrentPersonSupervisor] = useState({});
        const [dialogOptions, setDialogOptions] = useState({});

        // CONST ########################################################################################################################################
        const defaultPersonSupervisor = {
            person_supervisor_id: 0, 
            university_id: "", 
            supervisor_id: ""
        };

        // MODAL ########################################################################################################################################
        const [isOpenModalCrudPersonSupervisor, openModalCrudPersonSupervisor, closeModalCrudPersonSupervisor] = useModal();  

        // CRUD #########################################################################################################################################
        const updatePersonSupervisorIsActive = async person_supervisor_id => {
            try {
                const res = await axios.put("person-supervisor/" + person_supervisor_id);
                if (!res.data.error) {
                    fetch(person_id);
                };
            } catch (err) {
                console.log(err);
            };
        };

        // HANDLES ######################################################################################################################################
        const handleExpandir = personSupervisor => {
            if (personSupervisor.person_supervisor_id === currentPersonSupervisor.person_supervisor_id) {
                setCurrentPersonSupervisor(0);
            } else {
                setCurrentPersonSupervisor(personSupervisor);
            };
        };

        const handleDelete = (e, personSupervisor) => {
            e.stopPropagation();
            setDialogOptions({family: "delete", title: 'Delete this personSupervisor?', text: 'Are you sure you want to delete this personSupervisor?', action: () => updatePersonSupervisorIsActive(personSupervisor.person_supervisor_id) });
        };

        const handleUpdate = (e, personSupervisor) => {
            e.stopPropagation();
            setCurrentPersonSupervisor(personSupervisor);
            openModalCrudPersonSupervisor();
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

        const renderTableRows = personSupervisor => {
            var classContent = "";
            var classActions = "";
    
            if (personSupervisor.person_supervisor_id === currentPersonSupervisor.person_supervisor_id) {
                classContent = "content unhide"
                classActions = "unhide"
            } else {
                classContent = "content hide"
                classActions = "hide"
            };
    
            return (
                <tr key={personSupervisor.person_supervisor_id} onClick={() => handleExpandir(personSupervisor)}>
                    <td className="head">
                        {renderAvatar(personSupervisor)}
                        <div className="dropdown">
                            {renderDropDown(personSupervisor)}
                        </div>
                    </td>
                    <td className={classContent} data-label='University'>{personSupervisor.university_name}</td>
                    <td className={classContent} data-label='State'>{personSupervisor.state_name}</td>
                    <td className={classActions}>{renderActions(personSupervisor)}</td>
                </tr>  
            );
        };

        const renderActions = personSupervisor => {
            return (
                <div className="td-container">
                   {renderDropDown(personSupervisor)}
                </div>
            );
        };

        const renderAvatar = personSupervisor => {
            return (
                <div className="avatar-container">
                    <Avatar.Letter>{personSupervisor.supervisor_fullname[0]}</Avatar.Letter>
                    {personSupervisor.supervisor_fullname}
                </div>
            );
        };

        const renderDropDown = personSupervisor => {
            return (
                <DropDown.ButtonIcon family="more">
                    <div onClick={e => handleUpdate(e, personSupervisor)}>Update</div>
                    <div onClick={e => handleDelete(e, personSupervisor)}>Delete</div>
                </DropDown.ButtonIcon>
            );
        };

        // JSX ######################################################################################################################################
        return (
            <>
                {/* TABLE SUPERVISOR UNIVERSITY  #################################################################################################### */}
                <Modal.Form isOpen={isOpen} closeModal={close} width="700px">
                    <Container.Basic>
                        <ButtonCircle.Icon family="new" left="5px" top="5px" fontSize="17px" onClick={e => handleUpdate(e, defaultPersonSupervisor)} />
                        <Title.Basic>Person Supervisors</Title.Basic>
                        {personSupervisors.length === 0 
                            ?   <Container.NoRows>There is not personSupervisor.</Container.NoRows>
                            :   <Table.Basic margin="10px 0 0 0" borderBottom="none">
                                    <thead>{renderTableHead()}</thead>
                                    <tbody>{personSupervisors.map(personSupervisor => renderTableRows(personSupervisor))}</tbody>
                                </Table.Basic>
                        }
                    </Container.Basic>
                </Modal.Form>

                {/* CRUD SUPERVISOR UNIVERSITY  ##################################################################################################### */}
                <CrudPersonSupervisor.Basic person_id={person_id} fetch={fetch} personSupervisor={currentPersonSupervisor} isOpen={isOpenModalCrudPersonSupervisor} close={closeModalCrudPersonSupervisor} /> 

                {/* DIALOG ############################################################################################################################## */}
                <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
            </>
        );
    }
};

export default ListPersonSupervisor