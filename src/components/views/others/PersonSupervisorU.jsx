import { Title, Container, ButtonFloat, Modal, Select, Button, Loading, Table, DropDown, Avatar, Dialog } from "../../../component";
import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
import useList from '../../../hooks/useList';
import axios from '../../../config/axios'
import useAppContext from '../../../hooks/useAppContext';


export default function PersonSupervisorU() {
    
    // CONTEXT ######################################################################################################################################
    const { user } = useAppContext();
    useEffect(() => fetchPersonSupervisorsByPersonId(user.person_id), [user]);

    // CONST ########################################################################################################################################
    const defaultPersonSupervisor = {password: "", passwordConfirm: ""};

    // STATE ########################################################################################################################################
    const [personSupervisors, setPersonSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPersonSupervisor, setCurrentPersonSupervisor] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});

    // MODAL ########################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();

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

    // FETCHS #######################################################################################################################################
    const fetchPersonSupervisorsByPersonId = async id => {
        setLoading(true);
        const personSupervisors = await getList("person-supervisor/" + id);
        setPersonSupervisors(personSupervisors);
        setLoading(false);
    };

    // CRUD #########################################################################################################################################
    const updatePersonSupervisor = async data => {
        try {
            const res = await axios.post("person-supervisor", {person_id: user.person_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchPersonSupervisorsByPersonId(user.person_id)
                    closeModalCrud();
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

    const updatePersonSupervisorIsActive = async user_id => {
        try {
            const res = await axios.put("user/" + user_id);
            if (!res.data.error) {
                fetchPersonSupervisorsByPersonId(user.person_id)
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

    const handleUpdate = (e, personSupervisor) => {
        e.stopPropagation();
        setCurrentPersonSupervisor(personSupervisor);
        resetCrud(personSupervisor);
        openModalCrud();
    };

    const handleDelete = (e, personSupervisor) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this supervisor?', text: 'Are you sure you want to delete this supervisor?', action: () => updatePersonSupervisorIsActive(personSupervisor.person_supervisor_id) });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Supervisor</th>
                <th>University</th>
                <th>Orcid Number Link</th>
                <th>Researchgate Website</th>
                <th>Academic Google</th>
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

                <td className={classContent} data-label='Orcid Number Link'>{personSupervisor.supervisor_orcid_web}</td>
                <td className={classContent} data-label='Researchgate Website'>{personSupervisor.supervisor_research_web}</td>
                <td className={classContent} data-label='Academic Google'>{personSupervisor.supervisor_academic_web}</td>

                <td className={classActions}>{renderActions(personSupervisor)}</td>
            </tr>  
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

    const renderActions = personSupervisor => {
        return (
            <div className="td-container">
               {renderDropDown(personSupervisor)}
            </div>
        );
    };

    const renderDropDown = personSupervisor => {
        return (
            <DropDown.ButtonIcon family="more">
                <div onClick={e => handleDelete(e, personSupervisor)}>Delete</div>
            </DropDown.ButtonIcon>
        );
    };

    return (
        <Container.Primary>
            <Title.Primary>My Supervisor</Title.Primary>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{personSupervisors.map(personSupervisor => renderTableRows(personSupervisor))}</tbody>
                    </Table.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.Form isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>Add supervisor</Title.Basic>
                    <Select.Validation name="university_id" label="University" placeholder="Select a university" register={registerCrud} content={universityList} error={errorsCrud.university_id}/>
                    <Select.Validation name="supervisor_id" label="Supervisor" placeholder="Select a supervisor" register={registerCrud} content={supervisorList} error={errorsCrud.supervisor_id}/>
                    <Button.Basic onClick={handleSubmitCrud(updatePersonSupervisor)}>Save</Button.Basic>
                </Container.Basic>
            </Modal.Form>

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultPersonSupervisor)} hover family="newFloat"/>

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </Container.Primary>
    );
};